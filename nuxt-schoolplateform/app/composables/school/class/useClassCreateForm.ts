import { toast } from "vue-sonner";
import { toApiPayload } from "~/lib/form";
import type { SelectOption } from "~/lib/schema";
import {
  classCreateForm,
  type ClassCreateForm,
  type ClassCreateFormFull,
  type ClassCreateREQ,
} from "~/schemas/school/class";

interface ClassCreateFormLookups {
  academics: SelectOption[];
  grades: SelectOption[];
}

export const useClassCreateForm = () => {
  const { user } = useAuth();
  const headers = useRequestHeaders(["cookie"]);
  const cancelForm = () => {
    useRouter().back();
  };

  const { fields, handleSubmit, meta, errors, isSubmitting, values } =
    useCustomFields({
      validationSchema: classCreateForm,
      initialValues: {
        grade_name: Array(30).fill(""),
      },
    });

  // CREATE
  const create = () => {
    const { data: cachedData } =
      useNuxtData<ClassCreateFormLookups>("class-create");
    const defaultValues = ref<typeof asyncData.data.value>();

    const asyncData = useAsyncData(
      "class-create",
      async () => {
        const fetchMaps = {
          academics:
            cachedData.value && cachedData.value?.academics.length > 0
              ? Promise.resolve(cachedData.value?.academics)
              : $fetch("/api/class/academic", { headers }),
          grades:
            cachedData.value && cachedData.value?.grades.length > 0
              ? Promise.resolve(cachedData.value?.grades)
              : $fetch("/api/class/grade", { headers }),
        };
        const results = await Promise.allSettled(Object.values(fetchMaps));
        const keys = Object.keys(fetchMaps) as (keyof typeof fetchMaps)[];
        return keys.reduce((acc, key, index) => {
          const result = results[index];
          const rawValue = result!.status === "fulfilled" ? result!.value : [];
          acc[key] = Array.isArray(rawValue) ? rawValue : rawValue?.data || [];
          return acc;
        }, {} as Record<keyof typeof fetchMaps, SelectOption[]>);
      },
      { default: undefined }
    );

    // on grade name change
    const onGradeNameChange = (index: number, value: string) => {
      const current = fields.grade_name.model.value || [];
      const newArray = [...current];
      newArray[index] = value;
      fields.grade_name.model.value = newArray;
    };

    // async data for lookup values
    watch(
      () => asyncData.data.value,
      (newValue) => {
        if (newValue) {
          defaultValues.value = newValue;
        }
      },
      { immediate: true }
    );

    watch(
      () => asyncData.error.value,
      (error) => {
        if (error) {
          toast.error(`ERROR: ${error.statusMessage}`);
        }
      },
      { immediate: true }
    );

    const submitForm = handleSubmit(async (data) => {
      try {
        const values = data as ClassCreateForm;
        const appendedData = {
          ...values,
          grade_name:
            values.grade_name.filter((name) => name.trim() !== "") ?? [],
          created_by: user.value?.id!,
          updated_by: user.value?.id!,
          location_code: user.value?.location_code!,
        } satisfies ClassCreateFormFull;
        const payload = toApiPayload(appendedData) satisfies ClassCreateREQ;

        const { ok } = await $fetch.raw("/api/class", {
          method: "POST",
          headers,
          body: payload,
        });
        if (ok) toast.success("ការរក្សាទុកបានជោគជ័យ!");
        await navigateTo("/app/dashboard/school/class");
      } catch (error: any) {
        toast.error(
          `${error?.response?.status} ការរក្សាទុកមិនជោគជ័យ! ${error?.data?.message}`
        );
        console.error("Creating class error: ", error.data);
      }
    });

    return {
      asyncData,
      defaultValues,
      fields,
      handleSubmit,
      submitForm,
      meta,
      errors,
      isSubmitting,
      values,
      onGradeNameChange,
    };
  };

  return {
    create,
    cancelForm,
  };
};
