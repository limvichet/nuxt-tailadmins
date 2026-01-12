import { toast } from "vue-sonner";
import { toApiPayload } from "~/lib/form";
import {
  staffTeachingUpdateForm,
  type StaffTeachingShowRES,
  type StaffTeachingUpdateForm,
  type StaffTeachingUpdateFormFull,
  type StaffTeachingUpdateREQ,
} from "~/schemas/school/staff-teaching";

export const useUpdateForm = (
  staffTeachingCode: string | string[] | undefined
) => {
  if (!staffTeachingCode) {
    throw createError({
      statusCode: NOT_FOUND.code,
      statusMessage: "Can't update class without code!",
      fatal: true,
    });
  }

  const code = Array.isArray(staffTeachingCode)
    ? staffTeachingCode[0]
    : staffTeachingCode;
  const { user } = useAuth();
  const headers = useRequestHeaders(["cookie"]);
  const cancelForm = () => {
    useRouter().back();
  };

  const { fields, handleSubmit, meta, errors, isSubmitting, setValues } =
    useCustomFields({
      validationSchema: staffTeachingUpdateForm,
      validateOnMount: true,
    });

  // UPDATE
  const update = () => {
    const defaultValues = ref<StaffTeachingShowRES>();

    const asyncData = useAsyncData(
      `staff-teaching-edit-${code}`,
      async () =>
        $fetch<StaffTeachingShowRES>(`/api/staff-teaching/${code}`, {
          headers,
        }),
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
        const values = data as StaffTeachingUpdateForm;
        const existingData = defaultValues?.value?.data;
        const appendedData = {
          ...values,
          teaching_id: existingData?.teaching_id!,
          location_code: user.value?.location_code!,
          created_by: existingData?.created_by ?? user.value?.id!,
          updated_by: user.value?.id!,
        } satisfies StaffTeachingUpdateFormFull;
        const payload = toApiPayload({
          ...appendedData,
          add_teaching: values.add_teaching ? 1 : 0,
          chief_technical: values.chief_technical ? 1 : 0,
          bi_language: values.bi_language ? 1 : 0,
          teach_english: values.teach_english ? 1 : 0,
          class_incharge: values.class_incharge ? 1 : 0,
        }) satisfies StaffTeachingUpdateREQ;

        await $fetch<StaffTeachingUpdateREQ>(`/api/staff-teaching/${code}`, {
          method: "PUT",
          headers,
          body: payload,
        });
        toast.success("ការកែប្រែបានជោគជ័យ!");
        await navigateTo("/app/dashboard/school/staff-teaching");
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
