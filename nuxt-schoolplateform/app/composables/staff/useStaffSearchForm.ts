import { toast } from "vue-sonner";
import { getParam } from "~/lib/utils";
import { staffSearchForm, type StaffSearchRES } from "~/schemas/staff";

export const useStaffSearchForm = (
  route: ReturnType<typeof useRoute>,
  router: ReturnType<typeof useRouter>
) => {
  if (!route && !router)
    throw createError({
      statusCode: NOT_FOUND.code,
      statusMessage: "Can't search staff without `Route` and `Router`!",
    });

  const headers = useRequestHeaders(["cookie"]);
  const isTableActing = ref<boolean>(false);

  const { fields, handleSubmit, meta, isSubmitting, resetForm } =
    useCustomFields({
      validationSchema: staffSearchForm,
      initialValues: {
        staff_name: (route.query.staff_name as string) || undefined,
      },
    });

  // initial searching based on url query
  const {
    data: searchResults,
    pending,
    refresh,
    error: searchError,
  } = useLazyAsyncData(
    "staff-search",
    async () => {
      return $fetch<StaffSearchRES>("/api/staff/search", {
        headers,
        query: {
          staff_name: (route.query.staff_name as string) ?? " ",
          page: (route.query.page as string) ?? "1",
        },
      });
    },
    {
      watch: [
        toRef(() => route.query.staff_name),
        toRef(() => route.query.page),
      ],
    }
  );

  watch(
    searchError,
    (error) => {
      if (error) {
        toast.error(`ERROR: ${error.statusMessage}`);
      }
    },
    { immediate: true }
  );

  // clear form
  const clearForm = () => {
    resetForm({ values: { staff_name: undefined } });
    router.push({ path: route.path });
  };

  // form submission - school searching
  const submitForm = handleSubmit(async (data) => {
    router.push({ path: route.path, query: { staff_name: data.staff_name } });
  });

  // pagination methods
  const nextPage = () => {
    if (searchResults.value?.links.next) {
      router.push({
        path: route.path,
        query: {
          ...route.query,
          page: getParam("page", searchResults.value.links.next) ?? "1",
        },
      });
    }
  };

  const prevPage = () => {
    if (searchResults.value?.links.prev) {
      router.push({
        path: route.path,
        query: {
          ...route.query,
          page: getParam("page", searchResults.value.links.prev) ?? "1",
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
        (item: StaffSearchRES["data"][0]) =>
          item.staff_name.toLowerCase().includes(term) ||
          item.staff_phone.toLowerCase().includes(term) ||
          item.staff_dob.toLowerCase().includes(term) ||
          item.payroll_id.toString().toLowerCase().includes(term)
      );
    }
    return processedResult as StaffSearchRES["data"];
  });

  const handleAction = async (
    action: "EDIT" | "DELETE",
    staff: StaffSearchRES["data"][0]
  ) => {
    const { open } = useAlertDialog();
    if (action === "EDIT") {
      router.push(`/app/dashboard/staff/${staff.staff_id}/edit`);
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
        const res = await $fetch.raw(`/api/staff/${staff.staff_id}`, {
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
    pending,
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
