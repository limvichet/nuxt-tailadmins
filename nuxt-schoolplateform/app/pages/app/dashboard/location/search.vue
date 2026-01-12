<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { getParam, noQueries, tableIndex } from "~/lib/utils";
import {
  type AllLocationsResponse,
  type LocationCommuneResponse,
  type LocationDistrictResponse,
  type LocationVillageResponse,
} from "~/types/location";
import { schoolSearchSchema, type SchoolSearchForm } from "~/schemas/location";
import { INVALID_VALUE } from "~/lib/constant";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

// independent arrays - fetch data when this page is loaded
const headers = useRequestHeaders(["cookie"]);
const { data } = await useAsyncData("school-search-data", async () => {
  const [types, provinces] = await Promise.allSettled([
    $fetch("/api/location/locationType", { headers }),
    $fetch("/api/location/locationProvince", { headers }),
  ]);
  return {
    locationTypes: types.status === "fulfilled" ? types.value : null,
    locationProvinces:
      provinces.status === "fulfilled" ? provinces.value : null,
  };
});
const locationTypes = toRef(data.value?.locationTypes);
const locationProvinces = toRef(data.value?.locationProvinces);

// dependent arrays based on form values
const locationDistricts = ref<LocationDistrictResponse["data"]>([]);
const locationCommunes = ref<LocationCommuneResponse["data"]>([]);
const locationVillages = ref<LocationVillageResponse["data"]>([]);

const route = useRoute();
const router = useRouter();

use1EZSeo({
  title: computed(() => {
    return !!route.query.q
      ? `"${route.query.q as string}" Search Results!`
      : `${defaultSeo.title} - School Search`;
  }),
  description: "You can find any information about School in this page!",
});

// validation setup with default values (from url)
const {
  handleSubmit,
  setFieldValue,
  meta,
  isSubmitting,
  values,
  resetField,
  resetForm,
} = useForm<SchoolSearchForm>({
  validationSchema: toTypedSchema(schoolSearchSchema),
  initialValues: {
    locationType: route.query.location_type
      ? ({
          id: parseInt(route.query.location_type as string),
          value:
            (locationTypes.value?.data ?? []).find(
              (LT) => LT.id.toString() === route.query.location_type
            )?.value ?? INVALID_VALUE,
        } as SchoolSearchForm["locationType"])
      : null,
    locationProvince: route.query.pro_code
      ? ({
          id: route.query.pro_code as string,
          value: (locationProvinces.value?.data ?? []).find(
            (LP) => LP.id === route.query.pro_code
          )?.value,
        } as SchoolSearchForm["locationProvince"])
      : null,
    locationDistrict: null,
    locationCommune: null,
    locationVillage: null,
    searchQuery: (route.query.q as string) || undefined,
  },
});

// initial searching based on url query
const {
  data: allSchools,
  pending,
  refresh,
} = await useAsyncData(
  "school-search",
  async () => {
    const params = {
      q: route.query.q as string,
      location_type: route.query.location_type as string,
      pro_code: route.query.pro_code as string,
      dis_code: route.query.dis_code as string,
      com_code: route.query.com_code as string,
      vil_code: route.query.vil_code as string,
      page: (route.query.page as string) ?? "1",
    };
    return $fetch<AllLocationsResponse>("/api/location/all-locations", {
      headers,
      params,
    });
  },
  {
    watch: [
      toRef(() => route.query.q),
      toRef(() => route.query.location_type),
      toRef(() => route.query.pro_code),
      toRef(() => route.query.dis_code),
      toRef(() => route.query.com_code),
      toRef(() => route.query.vil_code),
      toRef(() => route.query.page),
    ],
    lazy: true,
  }
);

// clear form
const clearForm = () => {
  resetForm({
    values: {
      locationType: null,
      locationProvince: null,
      locationDistrict: null,
      locationCommune: null,
      locationVillage: null,
      searchQuery: undefined,
    },
  });
  router.push({ path: route.path });
};
const continuous = (num: number) => {
  return computed(() =>
    route.query.page && parseInt(route.query.page as string) > 1
      ? num +
        allSchools.value?.meta.per_page! *
          (parseInt(route.query.page as string) - 1)
      : num
  );
};

// form submission - school searching
const submitForm = handleSubmit(async (data) => {
  router.push({
    path: route.path,
    query: {
      location_type: data.locationType?.id as string,
      pro_code: data.locationProvince?.id as string,
      dis_code: data.locationDistrict?.id as string,
      com_code: data.locationCommune?.id as string,
      vil_code: data.locationVillage?.id as string,
      q: data.searchQuery,
    },
  });
});
// pagination methods
const nextPage = () => {
  if (allSchools.value?.links.next) {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        page: getParam("page", allSchools.value.links.next),
      },
    });
  }
};
const prevPage = () => {
  if (allSchools.value?.links.prev) {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        page: getParam("page", allSchools.value.links.prev),
      },
    });
  }
};

// handle fetching dependent arrays
const handleFetchDistricts = async (pro_code: string) => {
  const { data } = await $fetch<LocationDistrictResponse>(
    "/api/location/locationDistrict",
    { params: { pro_code }, headers }
  );
  locationDistricts.value = data;
};

const handleFetchCommunes = async (dis_code: string) => {
  const { data } = await $fetch<LocationCommuneResponse>(
    "/api/location/locationCommune",
    { params: { dis_code }, headers }
  );
  locationCommunes.value = data;
};

const handleFetchVillages = async (com_code: string) => {
  const { data } = await $fetch<LocationVillageResponse>(
    "/api/location/locationVillage",
    { params: { com_code }, headers }
  );
  locationVillages.value = data;
};

watch(
  () => values.locationProvince!,
  async (newProvince) => {
    // When province changes, reset dependent fields and fetch new data
    resetField("locationDistrict");
    resetField("locationCommune");
    resetField("locationVillage");
    locationDistricts.value = [];
    locationCommunes.value = [];
    locationVillages.value = [];
    if (newProvince) {
      await handleFetchDistricts(newProvince.id as string);
      // populate district field
      const disCodeFromUrl = route.query.dis_code as string;
      if (disCodeFromUrl) {
        const districtToSet = locationDistricts.value.find(
          (d) => d.id === disCodeFromUrl
        );
        if (districtToSet) {
          setFieldValue("locationDistrict", districtToSet);
        }
      }
    }
  },
  {
    immediate: !!route.query.pro_code,
  }
);

watch(
  () => values.locationDistrict!,
  async (newDistrict) => {
    // When district changes, reset dependent fields and fetch new data
    resetField("locationCommune");
    resetField("locationVillage");
    locationCommunes.value = [];
    locationVillages.value = [];
    if (newDistrict) {
      await handleFetchCommunes(newDistrict.id as string);
      // populate commune field
      const comCodeFromUrl = route.query.com_code as string;
      if (comCodeFromUrl) {
        const communeToSet = locationCommunes.value.find(
          (c) => c.id === comCodeFromUrl
        );
        if (communeToSet) {
          setFieldValue("locationCommune", communeToSet);
        }
      }
    }
  },
  {
    immediate: !!route.query.dis_code,
  }
);

watch(
  () => values.locationCommune!,
  async (newCommune) => {
    // When commune changes, reset dependent fields and fetch new data
    resetField("locationVillage");
    locationVillages.value = [];
    if (newCommune) {
      await handleFetchVillages(newCommune.id as string);
      // populate village field
      const villCodeFromUrl = route.query.vil_code as string;
      if (villCodeFromUrl) {
        const villageToSet = locationVillages.value.find(
          (v) => v.id === villCodeFromUrl
        );
        if (villageToSet) {
          setFieldValue("locationVillage", villageToSet);
        }
      }
    }
  },
  {
    immediate: !!route.query.com_code,
  }
);

// TABLE FILTERING
// Filtering
const searchTerm = ref<string>("");

// Processed data with filtering
const processedData = computed(() => {
  let processedResult = (allSchools.value?.data ?? []).map(
    (item: AllLocationsResponse["data"][0]) => ({
      location_type_id:
        (locationTypes.value?.data ?? []).find(
          (t) => t.id === item.location_type_id
        )?.value || item.location_type_id,
      location_code: item.location_code,
      location_kh: item.location_kh,
    })
  );
  // Filtering
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    processedResult = processedResult.filter(
      (item: {
        location_type_id: string | number;
        location_code: string;
        location_kh: string;
      }) =>
        item.location_code.toLowerCase().includes(term) ||
        item.location_kh.toLowerCase().includes(term)
    );
  }
  return processedResult as AllLocationsResponse["data"];
});

// Row actions
type schoolActionType = {
  location_type_id: string | number;
  location_code: string;
  location_kh: string;
};

const isTableActing = ref<boolean>(false);
const handleAction = async (
  action: "EDIT" | "DELETE",
  school: schoolActionType
) => {
  const { open } = useAlertDialog();
  if (action === "EDIT") {
    router.push(`/app/dashboard/location/${school.location_code}/edit`);
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
        `/api/location/location/${school.location_code}`,
        { method: "DELETE", headers }
      );
      isTableActing.value = false;
      res.ok && toast.success(res._data?.message ?? "ការលុបព័ត៌មានបានជោគជ័យ!");
      await refresh();
    }
  }
};
</script>

<template>
  <div class="space-y-4 @container">
    <CustomPageTitle>
      <Icon name="lucide:search-check" />
      ស្វែងរកព័ត៌មានអង្គភាព
    </CustomPageTitle>
    <!-- TWO COLUMNS -->
    <div class="grid gap-4 grid-cols-1 @min-5xl:grid-cols-[1fr_1.5fr]">
      <!-- comboboxes -->
      <div class="grid gap-4 grid-cols-1 @xl:grid-cols-2">
        <div class="grid gap-2">
          <Label for="location-province">ក្រសួង/ខេត្ត</Label>
          <CustomComboboxWithList
            button-class="w-full"
            id="location-province"
            :model-value="values.locationProvince!"
            @update:model-value="(value) => setFieldValue('locationProvince', value!)"
            :options="locationProvinces?.data ?? []"
            placeholder="ជ្រើសរើសក្រសួង/ខេត្ត"
            search-placeholder="ជ្រើសរើសក្រសួង/ខេត្ត..."
          />
        </div>

        <div class="grid gap-2">
          <Label for="location-district">ស្រុក/ខណ្ឌ/ក្រុង</Label>
          <CustomComboboxWithList
            button-class="w-full"
            id="location-district"
            :model-value="values.locationDistrict!"
            @update:model-value="(value) => setFieldValue('locationDistrict', value!)"
            :refetch-base-on="values.locationProvince?.value"
            :options="locationDistricts ?? []"
            placeholder="ជ្រើសរើសស្រុក/ខណ្ឌ/ក្រុង"
            search-placeholder="ជ្រើសរើសស្រុក/ខណ្ឌ/ក្រុង..."
          />
        </div>

        <div class="grid gap-2">
          <Label for="location-commune">ឃុំ/សង្កាត់</Label>
          <CustomComboboxWithList
            button-class="w-full"
            id="location-commune"
            :model-value="values.locationCommune!"
            @update:model-value="(value) => setFieldValue('locationCommune', value!)"
            :refetch-base-on="values.locationDistrict?.value"
            :options="locationCommunes ?? []"
            placeholder="ជ្រើសរើសឃុំ/សង្កាត់"
            search-placeholder="ជ្រើសរើសឃុំ/សង្កាត់..."
          />
        </div>

        <div class="grid gap-2">
          <Label for="location-village">ភូមិ</Label>
          <CustomComboboxWithList
            button-class="w-full"
            id="location-village"
            :model-value="values.locationVillage!"
            @update:model-value="(value) => setFieldValue('locationVillage', value!)"
            :refetch-base-on="values.locationCommune?.value"
            :options="locationVillages ?? []"
            placeholder="ជ្រើសរើសភូមិ"
            search-placeholder="ជ្រើសរើសភូមិ..."
          />
        </div>
      </div>

      <!-- search box -->
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="location-type">ប្រភេទអង្គភាព</Label>
          <CustomComboboxWithList
            id="location-type"
            button-class="w-full"
            :model-value="values.locationType!"
            @update:model-value="(value) => setFieldValue('locationType', value!)"
            :options="locationTypes?.data ?? []"
            placeholder="ជ្រើសរើសប្រភេទអង្គភាព"
            search-placeholder="ជ្រើសរើសប្រភេទអង្គភាព..."
          />
        </div>
        <div class="grid gap-2">
          <Label for="search-query">ឈ្មោះអង្គភាព/លេខកូដអង្គភាព </Label>
          <Input
            type="text"
            id="search-query"
            placeholder="សូមបញ្ចូលឈ្មោះអង្គភាព ឬលេខកូដអង្គភាព..."
            :model-value="values.searchQuery"
            @update:model-value="(value) => setFieldValue('searchQuery', value as string)"
            @keydown.enter="submitForm"
          />
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center gap-4">
      <!-- clear form button -->
      <Button
        :disabled="!meta.valid && noQueries(route)"
        variant="outline"
        @click="clearForm"
      >
        <Icon name="lucide:delete" />សម្អាត
      </Button>
      <!-- submit button -->
      <Button v-if="isSubmitting || pending" disabled>
        <Icon name="svg-spinners:180-ring-with-bg" />កំពុងស្វែងរក...
      </Button>
      <Button v-else :disabled="!meta.valid" @click="submitForm">
        <Icon name="lucide:search" />ស្វែងរក
      </Button>
    </div>
    <!-- search results -->
    <template v-if="allSchools !== null && allSchools !== undefined">
      <div v-if="allSchools!.data.length > 0" class="w-full space-y-4">
        <!-- actual search result -->
        <div class="space-y-4">
          <!-- Filter Input -->
          <div class="w-full max-w-md">
            <Input
              v-model="searchTerm"
              placeholder="ស្វែងរកព័ត៌មានអង្គភាពក្នុងតារាងខាងក្រោម..."
            />
          </div>

          <!-- searched brief info -->
          <div
            class="flex gap-2 flex-wrap justify-center items-center md:justify-between md:gap-0"
          >
            <!-- total school -->
            <p class="text-sm">
              រកឃើញចំនួន
              <span class="text-primary">{{ allSchools!.meta.total }}</span>
              អង្គភាព
            </p>
            <!-- page info -->
            <p class="text-sm">
              ទំព័រ
              <span class="text-primary">{{
                allSchools!.meta.current_page
              }}</span
              >/{{ allSchools!.meta.last_page }} &mdash; មាន
              <span class="text-primary">{{ allSchools!.meta.per_page }}</span>
              អង្គភាព/ទំព័រ
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
                    <div class="flex items-center">លេខកូដអង្គភាព</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ឈ្មោះអង្គភាព</div>
                  </TableHead>
                  <TableHead class="cursor-pointer">
                    <div class="flex items-center">ប្រភេទអង្គភាព</div>
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
                  v-for="(school, index) in processedData"
                  :key="index"
                  class="*:py-1"
                >
                  <TableCell class="font-medium">
                    {{
                      tableIndex(
                        toRef(searchTerm),
                        index,
                        allSchools?.meta?.current_page,
                        allSchools?.meta?.per_page
                      )
                    }}
                  </TableCell>
                  <TableCell>{{ school.location_code }}</TableCell>
                  <TableCell>{{ school.location_kh }}</TableCell>
                  <TableCell>{{ school.location_type_id }}</TableCell>
                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="sm" class="py-0">
                          <Icon name="bi:three-dots" class="h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="handleAction('EDIT', school)">
                          កែប្រែព័ត៌មាន
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          @click="handleAction('DELETE', school)"
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
            :disabled="!!!allSchools!.links.prev || pending"
            variant="outline"
            >{{
              pending ? "កំពុងដំណើរការ..." : "&leftarrow; ទំព័រខាងក្រោយ"
            }}</Button
          >
          <Button
            @click="nextPage"
            :disabled="!!!allSchools!.links.next || pending"
            variant="outline"
            >{{
              pending ? "កំពុងដំណើរការ..." : "ទំព័រខាងមុខ &rightarrow;"
            }}</Button
          >
        </div>
      </div>
      <div
        v-else-if="allSchools!.data.length === 0"
        class="flex justify-center items-center"
      >
        <p class="italic text-primary font-bold sm:text-xl">
          មិនមែនព័ត៌មាននៅក្នុងប្រព័ន្ធ!
        </p>
      </div>
    </template>
  </div>
</template>
