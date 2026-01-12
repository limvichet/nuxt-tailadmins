import { toast } from "vue-sonner";
import { toApiPayload } from "~/lib/form";
import {
  classUpdateForm,
  type ClassShowRES,
  type ClassUpdateForm,
  type ClassUpdateFormFull,
  type ClassUpdateREQ,
} from "~/schemas/school/class";

export const useClassUpdateForm = (
  classCode: string | string[] | undefined
) => {
  if (!classCode) {
    throw createError({
      statusCode: NOT_FOUND.code,
      statusMessage: "Can't update class without code!",
      fatal: true,
    });
  }

  const code = Array.isArray(classCode) ? classCode[0] : classCode;
  const { user } = useAuth();
  const headers = useRequestHeaders(["cookie"]);
  const cancelForm = () => {
    useRouter().back();
  };

  const { fields, handleSubmit, meta, errors, isSubmitting, setValues } =
    useCustomFields({
      validationSchema: classUpdateForm,
      validateOnMount: true,
    });

  // UPDATE
  const update = () => {
    const defaultValues = ref<ClassShowRES>();

    const asyncData = useAsyncData(
      `class-edit-${code}`,
      async () => $fetch<ClassShowRES>(`/api/class/${code}`, { headers }),
      { immediate: false }
    );

    const loadData = async () => {
      await asyncData.execute();
      if (asyncData.data.value?.data) {
        defaultValues.value = asyncData.data.value;
        setValues(asyncData.data.value.data);
      }
    };

    const submitForm = handleSubmit(async (data, actions) => {
      try {
        const values = data as ClassUpdateForm;
        const existingData = defaultValues?.value?.data;
        const appendedData = {
          ...values,
          tgrade_id: existingData?.tgrade_id!,
          location_code: user.value?.location_code!,
          created_by: existingData?.created_by ?? user.value?.id!,
          updated_by: user.value?.id!,
        } satisfies ClassUpdateFormFull;
        const payload = toApiPayload(appendedData) satisfies ClassUpdateREQ;

        await $fetch<ClassUpdateREQ>(`/api/class/${code}`, {
          method: "PUT",
          headers,
          body: payload,
        });
        toast.success("ការកែប្រែបានជោគជ័យ!");
        await navigateTo("/app/dashboard/school/class");
        actions.resetForm();
      } catch (error: any) {
        toast.error(
          `${error?.response?.status} ការកែប្រែមិនជោគជ័យ! ${error?.data?.message}`
        );
        console.error("Updating class error: ", error.data);
      }
    });

    return {
      loadData,
      asyncData,
      defaultValues,
      submitForm,
      fields,
      meta,
      errors,
      isSubmitting,
    };
  };

  return {
    update,
    cancelForm,
  };
};
