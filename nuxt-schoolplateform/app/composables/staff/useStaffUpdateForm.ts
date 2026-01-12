import { toast } from "vue-sonner";
import { toApiPayload } from "~/lib/form";
import type { SelectOption } from "~/lib/schema";
import {
  staffUpdateForm,
  type StaffUpdateRES,
  type StaffShowRES,
  type StaffUpdateForm,
  type StaffUpdateFormFull,
  type StaffUpdateREQ,
} from "~/schemas/staff";

export const useStaffUpdateForm = (
  staffCode: string | string[] | undefined
) => {
  if (!staffCode) {
    throw createError({
      statusCode: NOT_FOUND.code,
      statusMessage: "Can't update staff without code!",
      fatal: true,
    });
  }
  const code = Array.isArray(staffCode) ? staffCode[0] : staffCode;
  const { user } = useAuth();
  const headers = useRequestHeaders(["cookie"]);
  const cancelForm = () => {
    useRouter().back();
  };
  const fetchGradesByLevel = async (newSalaryLevelId: number) => {
    const endpoint = "/api/staff/salary-level-grade";
    const KOR1 = 1; // ក១
    const KHOR1 = 4; // ខ១
    const KO = 9; // គ
    if (newSalaryLevelId === KOR1 || newSalaryLevelId === KHOR1) {
      return $fetch<SelectOption[]>(endpoint, {
        query: { six: 1 },
        headers,
      });
    }
    if (newSalaryLevelId === KO) {
      return $fetch<SelectOption[]>(endpoint, {
        query: { ten: 1 },
        headers,
      });
    }
    return $fetch<SelectOption[]>(endpoint, { headers });
  };

  const {
    fields,
    handleSubmit,
    meta,
    errors,
    isSubmitting,
    values,
    setFieldValue,
    setValues,
  } = useCustomFields({
    validationSchema: staffUpdateForm,
    validateOnMount: true,
  });

  // UPDATE
  const update = () => {
    const defaultValues = ref<StaffShowRES>();
    const salaryLevelGrades1 = ref<SelectOption[]>([]);
    const salaryLevelGrades2 = ref<SelectOption[]>([]);

    const asyncData = useAsyncData(`staff-edit-${code}`, async () =>
      $fetch<StaffShowRES>(`/api/staff/${code}`, { method: "GET", headers })
    );

    watch(
      () => asyncData.data.value,
      (newValue) => {
        if (newValue && newValue.data) {
          defaultValues.value = newValue;

          salaryLevelGrades1.value =
            newValue.options?.salaryLevelGradesStart || [];
          salaryLevelGrades2.value =
            newValue.options?.salaryLevelGradesCurrent || [];

          setValues(newValue.data);
        }
      },
      { immediate: true }
    );

    watch(
      () => values.start_salary_level_id,
      async (newLevel) => {
        const id = typeof newLevel === "object" ? newLevel?.id : newLevel;
        if (!id) return;

        const res = await fetchGradesByLevel(Number(id));
        if (!res) return;
        setFieldValue("start_salary_degree", undefined as any as SelectOption);
        salaryLevelGrades1.value = res;
      }
    );

    watch(
      () => values.current_salary_level_id,
      async (newLevel) => {
        const id = typeof newLevel === "object" ? newLevel?.id : newLevel;
        if (!id) return;

        const res = await fetchGradesByLevel(Number(id));
        if (!res) return;
        setFieldValue(
          "current_salary_degree",
          undefined as any as SelectOption
        );
        salaryLevelGrades2.value = res;
      }
    );

    const submitForm = handleSubmit(async (data, actions) => {
      try {
        // @ts-ignore
        const values = data as StaffUpdateForm;
        const existingData = defaultValues?.value?.data;
        const appendedData = {
          ...values,
          staff_id: parseInt(code as string),
          created_by: existingData?.created_by ?? user.value?.id!,
          updated_by: user.value?.id!,
          staff_active: existingData?.staff_active ?? 1,
        } satisfies StaffUpdateFormFull;
        const payload = toApiPayload(appendedData) satisfies StaffUpdateREQ;

        await $fetch<StaffUpdateRES>(`/api/staff/${code}`, {
          method: "PUT",
          headers,
          body: payload,
        });
        toast.success("ការកែប្រែបានជោគជ័យ!");
        actions.resetForm();
      } catch (error: any) {
        toast.error(
          `${error?.response?.status} ការកែប្រែមិនជោគជ័យ! ${error?.data?.message}`
        );
        console.error("Updating staff error: ", error.data);
      }
    });

    return {
      asyncData,
      defaultValues,
      salaryLevelGrades1,
      salaryLevelGrades2,
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
