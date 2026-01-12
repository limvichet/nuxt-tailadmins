<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import type z from "zod";
import { tableIndex } from "~/lib/utils";
import {
  provinceCreateSchema,
  provinceSearchSchema,
  type ProvinceShowResponse,
  type ProvinceCreateResponse,
  type ProvinceSearchRequest,
  type ProvinceSearchResponse,
  provinceUpdateSchema,
  type ProvinceUpdateResponse,
} from "~/schemas/address/province";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

const route = useRoute();
const router = useRouter();
const headers = useRequestHeaders(["cookie"]);
const isTableActing = ref<boolean>(false);

use1EZSeo({
  title: computed(() => {
    const { page: _, ...rest } = route.query;
    return Object.values(rest).length > 0
      ? `"${Object.values(rest).join("-")}" Search Results!`
      : `${defaultSeo.title} - Province Resource`;
  }),
  description: "You can create, search and update provinces in this page!",
});

// validation setup with default values (from url) - search
const {
  handleSubmit,
  meta,
  resetForm,
  defineField: dfSearch,
} = useForm<ProvinceSearchRequest>({
  initialValues: {
    name_en: (route.query.name_en as string) ?? "",
    name_kh: (route.query.name_kh as string) ?? "",
  },
  validationSchema: toTypedSchema(provinceSearchSchema),
});
const [nameEN, nameENAttr] = dfSearch("name_en");
const [nameKH, nameKHAttr] = dfSearch("name_kh");

// initial searching based on url query
const {
  data: allProvinces,
  pending,
  refresh,
} = await useAsyncData(
  "province-search",
  async () => {
    const params = {
      nameEN: route.query.name_en as string,
      nameKH: route.query.name_kh as string,
      page: (route.query.page as string) ?? "1",
    };
    return $fetch<ProvinceSearchResponse>("/api/other/province/search", {
      headers,
      params,
    });
  },
  {
    watch: [
      toRef(() => route.query.name_en),
      toRef(() => route.query.name_kh),
      toRef(() => route.query.page),
    ],
    lazy: true,
  }
);

const submitFormSearch = handleSubmit(async (data) => {
  router.push({
    path: route.path,
    query: {
      name_en: data?.name_en ? data?.name_en : undefined,
      name_kh: data?.name_kh ? data?.name_kh : undefined,
    },
  });
});

const clearForm = () => {
  // reset search form
  resetForm({
    values: { name_en: undefined, name_kh: undefined },
  });
  router.push({ path: route.path });
  // reset (new) create form
  createDialogKey.value++;
};

const continuous = (num: number) => {
  return computed(() =>
    route.query.page && parseInt(route.query.page as string) > 1
      ? num +
        allProvinces.value?.meta.per_page! *
          (parseInt(route.query.page as string) - 1)
      : num
  );
};

// pagination methods
const nextPage = () => {
  if (allProvinces.value?.meta) {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        page: allProvinces.value?.meta.current_page + 1,
      },
    });
  }
};
const prevPage = () => {
  if (allProvinces.value?.meta) {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        page: allProvinces.value?.meta.current_page - 1,
      },
    });
  }
};

const searchTerm = ref<string>("");
const processedData = computed(() => {
  let processedResult = (allProvinces.value?.data ?? []).map(
    (item: ProvinceSearchResponse["data"][0]) => ({
      pro_code: item.pro_code,
      name_en: item.name_en,
      name_kh: item.name_kh,
      active: item.active,
    })
  );
  // Filtering
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    processedResult = processedResult.filter(
      (item: { name_en: string | number; name_kh: string | number }) =>
        item.name_en.toString().toLowerCase().includes(term) ||
        item.name_kh.toString().toLowerCase().includes(term)
    );
  }
  return processedResult as ProvinceSearchResponse["data"];
});

const isCreateDialogOpen = ref<boolean>(false);
const createDialogKey = ref<number>(0);
const submitFormCreate = async (data: z.infer<typeof provinceCreateSchema>) => {
  try {
    isTableActing.value = true;
    const { ok } = await $fetch.raw<ProvinceCreateResponse>(
      "/api/other/province",
      {
        method: "POST",
        headers,
        body: JSON.stringify(toValue(data)),
      }
    );
    if (ok) toast.success("ការរក្សាទុកបានជោគជ័យ!");
    isCreateDialogOpen.value = false;
    createDialogKey.value++;
    await refresh();
  } catch (error: any) {
    if (error?.response?.status === 422) {
      toast.error(`ការរក្សាទុកមិនជោគជ័យ! សូមជ្រើសរើសលេខកូដថ្មី!`);
    } else {
      toast.error(
        `${error?.response?.status} ការរក្សាទុកមិនជោគជ័យ! ${error?.data?.message}`
      );
    }
    console.error("Creating province error: ", error.data);
  } finally {
    isTableActing.value = false;
  }
};

const isEditDialogOpen = ref<boolean>(false);
const editingProvince = ref<ProvinceSearchResponse["data"][0] | null>(null);
const editDialogKey = ref<number>(0);

const submitFormUpdate = async (data: z.infer<typeof provinceUpdateSchema>) => {
  try {
    isTableActing.value = true;
    const { ok } = await $fetch.raw<ProvinceUpdateResponse>(
      `/api/other/province/${data.pro_code}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(toValue(data)),
      }
    );
    if (ok) toast.success("ការកែប្រែបានជោគជ័យ!");
    isEditDialogOpen.value = false;
    await refresh();
  } catch (error: any) {
    toast.error(
      `${error?.response?.status} ការកែប្រែមិនជោគជ័យ! ${error?.data?.message}`
    );
    console.error("Updating province error: ", error.data);
  } finally {
    isTableActing.value = false;
    editingProvince.value = null;
  }
};

const handleAction = async (
  action: "EDIT" | "DELETE",
  province: ProvinceSearchResponse["data"][0]
) => {
  const { open } = useAlertDialog();
  if (action === "EDIT") {
    // get data from API with province code
    try {
      isTableActing.value = true;
      const curPro = await $fetch<ProvinceShowResponse>(
        `/api/other/province/${province.pro_code}`,
        { method: "GET", headers }
      );
      // set the data to the dialog via useForm and open the dialog
      editingProvince.value = curPro.data;
      // open the dialog
      isEditDialogOpen.value = true;
    } catch (error) {
      console.log(`Editing province error: ${error}`);
    } finally {
      isTableActing.value = false;
    }
  }

  if (action === "DELETE") {
    const confirmed = await open({
      title: "តើអ្នកប្រាកដថាលុបព័ត៌មាននេះមែនទេ?",
      description: "ការលុបមិនអាចត្រឡប់ក្រោយបានឡើយ!",
      cancelText: "បោះបង់",
      confirmText: "លុបព័ត៌មាន",
    });
    if (confirmed) {
      try {
        isTableActing.value = true;
        const res = await $fetch.raw<{ message: string }>(
          `/api/other/province/${province.pro_code}`,
          { method: "DELETE", headers }
        );
        res.ok &&
          toast.success(res._data?.message ?? "ការលុបព័ត៌មានបានជោគជ័យ!");
        await refresh();
      } catch (error) {
        console.error(`Deleting province error: ${error}`);
      } finally {
        isTableActing.value = false;
      }
    }
  }
};
</script>

<template>
  <div class="space-y-4 @container">
    <CustomPageTitle>
      <Icon name="lucide:map-pin" />
      គ្រប់គ្រងទិន្នន័យអំពី ខេត្ត/រាជធានី
    </CustomPageTitle>

    <!-- CREATE & SEARCH Bar -->
    <div
      class="grid items-center gap-4 grid-cols-1 @3xl:grid-cols-[max-content_1fr]"
    >
      <!-- create province -->
      <Button @click="isCreateDialogOpen = true" class="justify-self-start">
        <Icon name="lucide:map-pin-plus" /> បង្កើតខេត្ត/រាជធានីថ្មី
      </Button>

      <LazyOtherProvinceCustomDialog
        hydrate-on-visible
        v-model:submit-status="isTableActing"
        v-model="isCreateDialogOpen"
        :key="createDialogKey"
        :dialog-schema="provinceCreateSchema"
        title="បង្កើតខេត្ត/រាជធានីថ្មី"
        subTitle="សូមបំពេញព័ត៌មានខាងក្រោម ដើម្បីបង្កើតខេត្ត/រាជធានីថ្មី!"
        submitText="បង្កើត"
        submitIcon="lucide:map-pin-plus"
        @submit="submitFormCreate"
      />

      <!-- search provinces -->
      <div class="@container">
        <form
          @submit.prevent="submitFormSearch"
          class="grid items-center gap-4 grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-[1fr_1fr_0.35fr_0.35fr]"
        >
          <Input
            v-model:model-value="nameKH"
            v-bind="nameKHAttr"
            placeholder="ឈ្មោះខេត្តជាភាសាខ្មែរ..."
          />
          <Input
            v-model:model-value="nameEN"
            v-bind="nameENAttr"
            placeholder="ឈ្មោះខេត្តជាអង់គ្លេស..."
          />
          <Button
            type="button"
            :disabled="!meta.valid"
            variant="outline"
            @click="clearForm"
          >
            <Icon name="lucide:delete" />សម្អាត
          </Button>
          <Button
            v-if="!pending"
            variant="secondary"
            type="submit"
            :disabled="!meta.valid"
          >
            <Icon name="lucide:search" />
            ស្វែងរក
          </Button>
          <Button v-else variant="secondary" disabled>
            <Icon name="svg-spinners:180-ring-with-bg" />
            កំពុងស្វែងរក...
          </Button>
        </form>
      </div>
    </div>

    <!-- search results -->
    <template v-if="allProvinces !== null && allProvinces !== undefined">
      <div v-if="allProvinces!.data.length > 0" class="w-full space-y-4">
        <!-- actual search result -->
        <div class="space-y-4">
          <!-- Filter Input -->
          <div class="w-full max-w-md">
            <Input
              v-model:model-value="searchTerm"
              placeholder="ស្វែងរកខេត្ត/រាជធានីក្នុងតារាងខាងក្រោម..."
            />
          </div>

          <!-- searched brief info -->
          <div
            class="flex gap-2 flex-wrap justify-center items-center md:justify-between md:gap-0"
          >
            <!-- total school -->
            <p class="text-sm">
              រកឃើញចំនួន
              <span class="text-primary">{{ allProvinces!.meta.total }}</span>
              ខេត្ត
            </p>
            <!-- page info -->
            <p class="text-sm">
              ទំព័រ
              <span class="text-primary">{{
                allProvinces!.meta.current_page
              }}</span
              >/{{ allProvinces!.meta.last_page }} &mdash; មាន
              <span class="text-primary">{{
                allProvinces!.meta.per_page
              }}</span>
              ខេត្ត/ទំព័រ
            </p>
          </div>

          <!-- Table -->
          <div class="rounded-md border">
            <Table :class="pending && 'table-loading'">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-25 cursor-pointer">
                    <div class="flex items-center">ល.រ.</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">លេខកូដខេត្ត/រាជធានី</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ឈ្មោះខេត្តជាភាសាខ្មែរ</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ឈ្មោះខេត្តជាអង់គ្លេស</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">សកម្ម</div>
                  </TableHead>
                  <TableHead class="text-right">
                    <span class="flex justify-end items-center gap-2">
                      <Icon
                        v-if="isTableActing"
                        name="svg-spinners:180-ring-with-bg"
                      />
                      <span>ផ្សេងៗ</span>
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(province, index) in processedData"
                  :key="index"
                  class="*:py-1"
                >
                  <TableCell class="font-medium">
                    {{
                      tableIndex(
                        toRef(searchTerm),
                        index,
                        allProvinces?.meta?.current_page,
                        allProvinces?.meta?.per_page
                      )
                    }}
                  </TableCell>
                  <TableCell>{{ province.pro_code }}</TableCell>
                  <TableCell>{{ province.name_kh }}</TableCell>
                  <TableCell>{{ province.name_en }}</TableCell>
                  <TableCell>
                    <LazyCustomActiveRow :condition="province.active === 1" />
                  </TableCell>
                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="sm" class="py-0">
                          <Icon name="bi:three-dots" class="h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          @click="handleAction('EDIT', province)"
                        >
                          កែប្រែព័ត៌មាន
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          @click="handleAction('DELETE', province)"
                        >
                          លុបព័ត៌មាន
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <!-- pagination -->
        <div class="flex items-center justify-between">
          <Button
            @click="prevPage"
            :disabled="allProvinces!.meta.current_page <= 1 || pending"
            variant="outline"
            >{{
              pending ? "កំពុងដំណើរការ..." : "&leftarrow; ទំព័រខាងក្រោយ"
            }}</Button
          >
          <Button
            @click="nextPage"
            :disabled="
              allProvinces!.meta.current_page === allProvinces!.meta.last_page ||
              pending
            "
            variant="outline"
            >{{
              pending ? "កំពុងដំណើរការ..." : "ទំព័រខាងមុខ &rightarrow;"
            }}</Button
          >
        </div>
      </div>
      <div
        v-else-if="allProvinces!.data.length === 0"
        class="flex justify-center items-center"
      >
        <p class="italic text-primary font-bold sm:text-xl">
          មិនមែនព័ត៌មាននៅក្នុងប្រព័ន្ធ!
        </p>
      </div>
    </template>

    <!-- Edit Dialog -->
    <LazyOtherProvinceCustomDialog
      v-if="editingProvince"
      hydrate-on-visible
      v-model:submit-status="isTableActing"
      v-model="isEditDialogOpen"
      :key="editDialogKey"
      :dialog-schema="provinceUpdateSchema"
      title="កែប្រែខេត្ត/រាជធានី"
      sub-title="សូមកែប្រែព័ត៌មានណាមួយ ដែលអ្នកចង់ផ្លាស់ប្ដូរ!"
      submit-text="កែប្រែ"
      submit-icon="lucide:edit"
      :default-values="editingProvince"
      :disabled-id="true"
      @submit="submitFormUpdate"
      @update:model-value="(value: boolean) => {if(!value) editingProvince = null}"
    />
  </div>
</template>
