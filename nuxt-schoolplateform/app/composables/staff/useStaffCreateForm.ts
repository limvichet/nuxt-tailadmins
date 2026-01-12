import { toast } from "vue-sonner";
import { toApiPayload } from "~/lib/form";
import type { SelectOption } from "~/lib/schema";
import {
  staffCreateForm,
  type StaffCreateForm,
  type StaffCreateFormFull,
  type StaffCreateREQ,
} from "~/schemas/staff";

export const useStaffCreateForm = () => {
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
  } = useCustomFields({
    validationSchema: staffCreateForm,
  });

  // CREATE
  const create = () => {
    const defaultValues = ref<typeof asyncData.data.value>();
    const salaryLevelGrades1 = ref<SelectOption[]>([]);
    const salaryLevelGrades2 = ref<SelectOption[]>([]);

    const asyncData = useAsyncData("staff-create", async () => {
      const fetchMaps = {
        genders: $fetch("/api/staff/gender", { headers }),
        statuses: $fetch("/api/staff/status", { headers }),
        subjects: $fetch("/api/staff/subject", { headers }),
        positions: $fetch("/api/staff/position", { headers }),
        qualificationsBacii: $fetch("/api/staff/qualification?bacii=1", {
          headers,
        }),
        qualifications: $fetch("/api/staff/qualification", { headers }),
        professionals: $fetch("/api/staff/professional", { headers }),
        professionalTypes: $fetch("/api/staff/professional-type", { headers }),
        institutions: $fetch("/api/staff/institution", { headers }),
        salaryLevels: $fetch("/api/staff/salary-level", { headers }),
        salaryLevelGrades: $fetch("/api/staff/salary-level-grade", { headers }),
      };
      const results = await Promise.allSettled(Object.values(fetchMaps));
      const keys = Object.keys(fetchMaps) as (keyof typeof fetchMaps)[];
      return keys.reduce((acc, key, index) => {
        const result = results[index];
        const rawValue = result!.status === "fulfilled" ? result!.value : [];
        acc[key] = Array.isArray(rawValue) ? rawValue : rawValue?.data || [];
        return acc;
      }, {} as Record<keyof typeof fetchMaps, SelectOption[]>);
    });

    watch(
      () => asyncData.data.value,
      (newValue) => {
        if (newValue) {
          defaultValues.value = newValue;
          salaryLevelGrades1.value = newValue.salaryLevelGrades || [];
          salaryLevelGrades2.value = newValue.salaryLevelGrades || [];
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
        const values = data as StaffCreateForm;
        const appendedData = {
          ...values,
          created_by: user.value?.id!,
          updated_by: user.value?.id!,
          staff_active: 1,
          location_code: user.value?.location_code!,
        } satisfies StaffCreateFormFull;
        const payload = toApiPayload(appendedData) satisfies StaffCreateREQ;

        const { ok } = await $fetch.raw("/api/staff", {
          method: "POST",
          headers,
          body: payload,
        });
        if (ok) toast.success("ការរក្សាទុកបានជោគជ័យ!");
        actions.resetForm();
      } catch (error: any) {
        toast.error(
          `${error?.response?.status} ការរក្សាទុកមិនជោគជ័យ! ${error?.data?.message}`
        );
        console.error("Creating staff error: ", error.data);
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
    create,
    cancelForm,
  };
};
