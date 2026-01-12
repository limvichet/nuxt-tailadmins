import { toast } from "vue-sonner";
import type { SelectOption } from "~/lib/schema";
import { getParam } from "~/lib/utils";
import {
  staffTeachingSearchForm,
  type StaffTeachingSearchRES,
} from "~/schemas/school/staff-teaching";

interface FormLookups {
  academics: SelectOption[];
  staffs: SelectOption[];
}

export const useSearchForm = (
  route: ReturnType<typeof useRoute>,
  router: ReturnType<typeof useRouter>
) => {
  if (!route && !router)
    throw createError({
      statusCode: NOT_FOUND.code,
      statusMessage:
        "Can't search staff teaching without `Route` and `Router`!",
    });

  const headers = useRequestHeaders(["cookie"]);
  const isTableActing = ref<boolean>(false);
  const { fields, handleSubmit, meta, isSubmitting, resetForm, setFieldValue } =
    useCustomFields({
      validationSchema: staffTeachingSearchForm,
    });

  const defaultValues = ref<FormLookups>();

  // fetch lookup data
  const asyncLookupData = useAsyncData(
    "staff-teaching-search-lookups",
    async () => {
      const fetchMaps = {
        academics: $fetch("/api/class/academic", { headers }),
        staffs: $fetch("/api/class/staff", { headers }),
      };
      const results = await Promise.allSettled(Object.values(fetchMaps));
      const keys = Object.keys(fetchMaps) as (keyof typeof fetchMaps)[];

      return keys.reduce((acc, key, index) => {
        const result = results[index];
        const rawValue = result!.status === "fulfilled" ? result!.value : [];
        acc[key] = Array.isArray(rawValue) ? rawValue : rawValue?.data || [];
        return acc;
      }, {} as Record<keyof typeof fetchMaps, SelectOption[]>);
    }
  );

  watch(
    () => asyncLookupData.data.value,
    (newLookups) => {
      if (newLookups) {
        defaultValues.value = newLookups;
      }
    },
    { immediate: true }
  );

  watch(
    () => route.query,
    () => {
      if (route.query.academic_id) {
        const selectedValue = defaultValues.value?.academics.find(
          (academic) => academic.id == route.query.academic_id
        );
        if (selectedValue)
          setFieldValue("academic_id", selectedValue as SelectOption);
      }
      if (route.query.staff_id) {
        const selectedValue = defaultValues.value?.staffs.find(
          (staff) => staff.id == route.query.staff_id
        );
        if (selectedValue)
          setFieldValue("staff_id", selectedValue as SelectOption);
      }
    },
    { immediate: true }
  );

  const selectedAcademic = computed(() => initializeAcademic());

  function initializeAcademic() {
    if (route.query.academic_id) {
      return route.query.academic_id as string;
    }
    if (defaultValues.value?.academics.length) {
      if (!fields.academic_id.model.value.id) {
        setFieldValue(
          "academic_id",
          defaultValues.value?.academics[0] as SelectOption
        );
      }
      return defaultValues.value?.academics[0]?.id as string;
    }
    return "";
  }

  const {
    data: searchResults,
    refresh,
    pending,
  } = useAsyncData(
    "staff-teaching-search",
    async () => {
      return $fetch<StaffTeachingSearchRES>("/api/staff-teaching/search", {
        headers,
        query: {
          academic_id: selectedAcademic.value,
          staff_id: route.query.staff_id,
          page: route.query.page ?? "1",
        },
      });
    },
    {
      watch: [
        () => selectedAcademic.value,
        () => route.query.staff_id,
        () => route.query.page,
      ],
      immediate: !!selectedAcademic.value,
    }
  );

  // clear form
  const clearForm = () => {
    resetForm();
    router.push({ path: route.path });
  };

  // form submission - school searching
  const submitForm = handleSubmit(async (data) => {
    router.push({
      path: route.path,
      query: { academic_id: data.academic_id.id, staff_id: data.staff_id?.id },
    });
  });

  // pagination methods
  const nextPage = () => {
    if (searchResults.value?.links.next_page_url) {
      router.push({
        path: route.path,
        query: {
          ...route.query,
          page:
            getParam("page", searchResults.value.links.next_page_url) ?? "1",
        },
      });
    }
  };

  const prevPage = () => {
    if (searchResults.value?.links.prev_page_url) {
      router.push({
        path: route.path,
        query: {
          ...route.query,
          page:
            getParam("page", searchResults.value.links.prev_page_url) ?? "1",
        },
      });
    }
  };

  // TABLE FILTERING
  const searchTerm = ref<string>("");

  // Filtering
  const processedData = computed(() => {
    let processedResult = searchResults.value?.data ?? [];
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase();
      processedResult = processedResult.filter(
        (item: StaffTeachingSearchRES["data"][0]) =>
          item.academic_id.toLowerCase().includes(term) ||
          item.staff_id.toLowerCase().includes(term) ||
          item.cgt_id.toLowerCase().includes(term)
      );
    }
    return processedResult;
  });

  const handleAction = async (
    action: "EDIT" | "DELETE",
    eachStaffTeaching: StaffTeachingSearchRES["data"][0]
  ) => {
    const { open } = useAlertDialog();
    if (action === "EDIT") {
      router.push(
        `/app/dashboard/school/staff-teaching/${eachStaffTeaching.teaching_id}/edit`
      );
    }
    if (action === "DELETE") {
      const confirmed = await open({
        title: "តើអ្នកប្រាកដថាលុបព័ត៌មាននេះមែនទេ?",
        description: "ការលុបមិនអាចត្រឡប់ក្រោយបានឡើយ!",
        cancelText: "បោះបង់",
        confirmText: "លុបព័ត៌មាន",
      });
      if (confirmed) {
        isTableActing.value = true;
        const res = await $fetch.raw(
          `/api/staff-teaching/${eachStaffTeaching.teaching_id}`,
          { method: "DELETE", headers }
        );
        isTableActing.value = false;
        res.ok &&
          toast.success(res._data?.message ?? "ការលុបព័ត៌មានបានជោគជ័យ!");
        await refresh();
      }
    }
  };

  return {
    isTableActing,
    fields,
    meta,
    isSubmitting,
    asyncLookupData,
    pending,
    defaultValues,
    searchResults,
    clearForm,
    submitForm,
    nextPage,
    prevPage,
    processedData,
    handleAction,
    searchTerm,
  };
};
