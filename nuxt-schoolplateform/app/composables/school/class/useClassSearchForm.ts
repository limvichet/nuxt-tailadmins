import { toast } from "vue-sonner";
import type { SelectOption } from "~/lib/schema";
import { getParam } from "~/lib/utils";
import { classSearchForm, type ClassSearchRES } from "~/schemas/school/class";

interface ClassSearchFormLookups {
  academics: SelectOption[];
  grades: SelectOption[];
}

export const useClassSearchForm = (
  route: ReturnType<typeof useRoute>,
  router: ReturnType<typeof useRouter>
) => {
  if (!route && !router)
    throw createError({
      statusCode: NOT_FOUND.code,
      statusMessage: "Can't search class without `Route` and `Router`!",
    });

  const headers = useRequestHeaders(["cookie"]);
  const isTableActing = ref<boolean>(false);
  const { fields, handleSubmit, meta, isSubmitting, resetForm, setFieldValue } =
    useCustomFields({
      validationSchema: classSearchForm,
    });

  const defaultValues = ref<ClassSearchFormLookups>();

  // fetch lookup data
  const asyncLookupData = useAsyncData("class-search-lookups", async () => {
    const fetchMaps = {
      academics: $fetch("/api/class/academic", { headers }),
      grades: $fetch("/api/class/grade", { headers }),
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
      if (route.query.grade_id) {
        const selectedValue = defaultValues.value?.grades.find(
          (grade) => grade.id == route.query.grade_id
        );
        if (selectedValue)
          setFieldValue("grade_id", selectedValue as SelectOption);
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
    "class-search",
    async () => {
      return $fetch<ClassSearchRES>("/api/class/search", {
        headers,
        query: {
          academic_id: selectedAcademic.value,
          grade_id: route.query.grade_id,
          page: route.query.page ?? "1",
        },
      });
    },
    {
      watch: [
        () => selectedAcademic.value,
        () => route.query.grade_id,
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
      query: { academic_id: data.academic_id.id, grade_id: data.grade_id?.id },
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
        (item: ClassSearchRES["data"][0]) =>
          item.academic_id.toLowerCase().includes(term) ||
          item.grade_id.toLowerCase().includes(term) ||
          item.grade_name.toLowerCase().includes(term)
      );
    }
    return processedResult;
  });

  const handleAction = async (
    action: "EDIT" | "DELETE",
    eachClass: ClassSearchRES["data"][0]
  ) => {
    const { open } = useAlertDialog();
    if (action === "EDIT") {
      router.push(`/app/dashboard/school/class/${eachClass.tgrade_id}/edit`);
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
        const res = await $fetch.raw(`/api/class/${eachClass.tgrade_id}`, {
          method: "DELETE",
          headers,
        });
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
