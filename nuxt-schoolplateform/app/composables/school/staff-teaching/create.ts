import { toast } from "vue-sonner";
import { toApiPayload } from "~/lib/form";
import type { SelectOption } from "~/lib/schema";
import {
  staffTeachingCreateForm,
  type StaffTeachingCreateForm,
  type StaffTeachingCreateFormFull,
  type StaffTeachingCreateREQ,
} from "~/schemas/school/staff-teaching";

interface FormLookups {
  academics: SelectOption[];
  staffs: SelectOption[];
  grade_types: SelectOption[];
}

export const useCreateForm = () => {
  const { user } = useAuth();
  const headers = useRequestHeaders(["cookie"]);
  const cancelForm = () => {
    useRouter().back();
  };

  const { fields, handleSubmit, meta, errors, isSubmitting, values } =
    useCustomFields({
      validationSchema: staffTeachingCreateForm,
      initialValues: {
        add_teaching: false,
        chief_technical: false,
        bi_language: false,
        teach_english: false,
        class_incharge: false,
      },
    });

  // CREATE
  const create = () => {
    const { data: cachedData } = useNuxtData<FormLookups>(
      "staff-teaching-create"
    );
    const defaultValues = ref<typeof asyncData.data.value>();

    const asyncData = useAsyncData(
      "staff-teaching-create",
      async () => {
        const fetchMaps = {
          academics:
            cachedData.value && cachedData.value?.academics.length > 0
              ? Promise.resolve(cachedData.value?.academics)
              : $fetch("/api/class/academic", { headers }),
          staffs:
            cachedData.value && cachedData.value?.staffs.length > 0
              ? Promise.resolve(cachedData.value?.staffs)
              : $fetch("/api/class/staff", { headers }),
          grade_types:
            cachedData.value && cachedData.value?.grade_types.length > 0
              ? Promise.resolve(cachedData.value?.grade_types)
              : $fetch("/api/class/grade-type", { headers }),
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
        const values = data as StaffTeachingCreateForm;
        const appendedData = {
          ...values,
          created_by: user.value?.id!,
          updated_by: user.value?.id!,
          location_code: user.value?.location_code!,
        } satisfies StaffTeachingCreateFormFull;
        const payload = toApiPayload({
          ...appendedData,
          add_teaching: values.add_teaching ? 1 : 0,
          chief_technical: values.chief_technical ? 1 : 0,
          bi_language: values.bi_language ? 1 : 0,
          teach_english: values.teach_english ? 1 : 0,
          class_incharge: values.class_incharge ? 1 : 0,
        }) satisfies StaffTeachingCreateREQ;

        const { ok } = await $fetch.raw("/api/staff-teaching", {
          method: "POST",
          headers,
          body: payload,
        });
        if (ok) toast.success("ការរក្សាទុកបានជោគជ័យ!");
        await navigateTo("/app/dashboard/school/staff-teaching");
      } catch (error: any) {
        toast.error(
          `${error?.response?.status} ការរក្សាទុកមិនជោគជ័យ! ${error?.data?.message}`
        );
        console.error("Creating staff teaching error: ", error.data);
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
    };
  };

  return {
    create,
    cancelForm,
  };
};
