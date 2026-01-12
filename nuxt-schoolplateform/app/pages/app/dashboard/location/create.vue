<script setup lang="ts">
import type {
  LocationDistrictResponse,
  LocationCommuneResponse,
  LocationVillageResponse,
  LocationLocationResponse,
  LocationStoreBody,
  LocationStoreResponse,
} from "~/types/location";
import { useField, useForm } from "vee-validate";
import { schoolCreateSchema, type SchoolCreateForm } from "~/schemas/location";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";
import { watchDebounced } from "@vueuse/core";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - School Create`,
  description:
    "You can create more information especially about School in this page and save it to your account!",
});

// validation setup
const {
  handleSubmit,
  meta,
  errors,
  isSubmitting,
  values,
  setFieldValue,
  setFieldError,
  resetField,
  validateField,
} = useForm<SchoolCreateForm>({
  validationSchema: toTypedSchema(schoolCreateSchema),
  initialValues: {
    locationType: undefined,
    locationProvince: undefined,
    locationDistrict: undefined,
    locationCommune: undefined,
    locationVillage: undefined,
    schoolNameKH: undefined,
    emergencyCode: null,
    haveProblem: false,
    toggleEmergencyCode: false,
    toggleSchoolAnnex: false,
  },
});
const { errors: trailingErrors, handleBlur: blurTrailing } = useField<
  SchoolCreateForm["trailingLocationCode"]
>("trailingLocationCode");

const customBlur = (event: FocusEvent) => {
  let curVal = values.trailingLocationCode || "";
  if (curVal.length < 3) curVal = curVal.padStart(3, "0").slice(0, 3);
  setFieldValue("trailingLocationCode", curVal);
  blurTrailing(event);
  const alreadyChoosing =
    !!values.locationVillage?.id && !!values.trailingLocationCode;
  if (alreadyChoosing) {
    validateLocationCode(
      values.locationVillage?.id as string,
      values.trailingLocationCode as string
    );
  }
};

const isLoading = ref<boolean>(false);
const validateLocationCode = async (vilId: string, code: string) => {
  isLoading.value = true;
  const { valid } = await validateField("trailingLocationCode");
  if (valid) {
    const headers = useRequestHeaders(["cookie"]);
    const { isFree } = await $fetch(
      `/api/location/free-location-code/${vilId + code}`,
      { headers }
    );
    setFieldError(
      "trailingLocationCode",
      !isFree ? "លេខកូដអង្គភាពនេះមានរួចហើយ!" : undefined
    );
  }
  isLoading.value = false;
};

watchDebounced(
  () => values.trailingLocationCode,
  (newTrailing) => {
    if (newTrailing && newTrailing.length < 3) {
      let curVal = newTrailing;
      if (curVal.length < 3) curVal = curVal.padStart(3, "0").slice(0, 3);
      setFieldValue("trailingLocationCode", curVal);
    }
  },
  { debounce: 2000, maxWait: 800 }
);

watch(
  [() => values.trailingLocationCode, () => values.locationVillage],
  async ([newTrailing, newVillage]) => {
    if (newTrailing && newVillage?.id) {
      await validateLocationCode(newVillage.id as string, newTrailing);
    }
  },
  { deep: true }
);

// independent ararys - prefetch data when app starts
const { data } = await useAsyncData("school-create-data", async () => {
  const headers = useRequestHeaders(["cookie"]);
  const [types, provinces, regions, levels] = await Promise.allSettled([
    $fetch("/api/location/locationType", { headers }),
    $fetch("/api/location/locationProvince", { headers }),
    $fetch("/api/location/region", { headers }),
    $fetch("/api/location/level", { headers }),
  ]);
  return {
    locationTypes: types.status === "fulfilled" ? types.value : null,
    locationProvinces:
      provinces.status === "fulfilled" ? provinces.value : null,
    locationRegions: regions.status === "fulfilled" ? regions.value : null,
    locationLevels: levels.status === "fulfilled" ? levels.value : null,
  };
});
const locationTypes = toRef(data.value?.locationTypes);
const locationProvinces = toRef(data.value?.locationProvinces);
const locationRegions = toRef(data.value?.locationRegions);
const locationLevels = toRef(data.value?.locationLevels);

const { user } = useAuth();
// form submission
const submitForm = handleSubmit(async (data, actions) => {
  const headers = useRequestHeaders(["cookie"]);
  const body = computed<LocationStoreBody>(() => ({
    location_type_id: data.locationType?.id as number,
    pro_code: data.locationProvince?.id as string,
    dis_code: data.locationDistrict?.id as string,
    com_code: data.locationCommune?.id as string,
    vil_code: data.locationVillage?.id as string,
    location_code:
      data.locationVillage?.id.toString() + data.trailingLocationCode!,
    temporary_code: data.toggleEmergencyCode ? 1 : 0,
    emis_code: data.emergencyCode!,
    location_kh: data.schoolNameKH,
    schoolclaster: data.locationLocation?.id as string,
    main_school: data.locationSchoolRelate?.id as string,
    school_annex: data.toggleSchoolAnnex ? 1 : 0,
    region_id: data.locationRegion?.id as number,
    multi_level_edu: data.locationLevel?.id as number,
    edu_level_id: data.edu_level_id?.id as number,
    disadvantage: data.haveProblem ? 1 : 0,
    location_history: data.schoolHistory,
    created_by: user.value?.id as number,
    updated_by: user.value?.id as number,
    active: 1,
  }));

  try {
    const { ok } = await $fetch.raw<LocationStoreResponse>(
      "/api/location/create",
      {
        method: "POST",
        headers,
        body: JSON.stringify(toValue(body)),
      }
    );
    if (ok) toast.success("ការរក្សាទុកបានជោគជ័យ!");
    actions.resetForm();
  } catch (error: any) {
    toast.error(
      `${error?.response?.status} ការរក្សាទុកមិនជោគជ័យ! ${error?.data?.message}`
    );
    console.error("Creating school error: ", error.data);
  }
});

// form cancel
onBeforeRouteLeave(async (to, from) => {
  if (meta.value?.dirty) {
    const { open } = useAlertDialog();
    const confirmed = await open({
      title: "តើអ្នកប្រាកដថាចាកចេញពីទំព័រនេះទេ?",
      description: "ការចាកចេញអាចបាត់បង់ព័ត៌មានដែលអ្នកបានបំពេញ!",
      cancelText: "មិនចាកចេញ",
      confirmText: "ចាកចេញ",
    });
    if (!confirmed) return false;
  }
  return true;
});

const cancelForm = () => {
  useRouter().back();
};

watch(
  () => values.locationProvince,
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
    }
  }
);

watch(
  () => values.locationDistrict,
  async (newDistrict) => {
    // When district changes, reset dependent fields and fetch new data
    resetField("locationCommune");
    resetField("locationVillage");
    locationCommunes.value = [];
    locationVillages.value = [];
    if (newDistrict) {
      await handleFetchCommunes(newDistrict.id as string);
    }
  }
);

watch(
  () => values.locationCommune,
  async (newCommune) => {
    // When commune changes, reset dependent fields and fetch new data
    resetField("locationVillage");
    resetField("locationLocation");
    locationVillages.value = [];
    locationLocations.value = [];
    if (newCommune) {
      await handleFetchVillages(newCommune.id as string);
      await handleFetchLocations(newCommune.id as string);
    }
  }
);

const handleFetchDistricts = async (pro_code: string) => {
  const { data } = await $fetch<LocationDistrictResponse>(
    "/api/location/locationDistrict",
    { params: { pro_code } }
  );
  locationDistricts.value = data;
};

const handleFetchCommunes = async (dis_code: string) => {
  const { data } = await $fetch<LocationCommuneResponse>(
    "/api/location/locationCommune",
    { params: { dis_code } }
  );
  locationCommunes.value = data;
};

const handleFetchVillages = async (com_code: string) => {
  const { data } = await $fetch<LocationVillageResponse>(
    "/api/location/locationVillage",
    { params: { com_code } }
  );
  locationVillages.value = data;
};

const handleFetchLocations = async (com_code: string) => {
  const { data } = await $fetch<LocationLocationResponse>(
    "/api/location/location",
    { params: { com_code } }
  );
  locationLocations.value = data;
};

// getting id from provinces, districts, communes, and villages
const ArrayOfVillageId = computed(() => {
  // Now uses `values` from vee-validate
  return values.locationVillage?.id
    ? (values.locationVillage?.id as string).match(/.{1,2}/g)
    : [
        values.locationProvince?.id ?? "00",
        values.locationDistrict?.id?.toString().slice(-2) ?? "00",
        values.locationCommune?.id?.toString().slice(-2) ?? "00",
        values.locationVillage?.id?.toString().slice(-2) ?? "00",
      ];
});

// dependent arrays based on form values
const locationDistricts = ref<LocationDistrictResponse["data"]>([]);
const locationCommunes = ref<LocationCommuneResponse["data"]>([]);
const locationVillages = ref<LocationVillageResponse["data"]>([]);
const locationLocations = ref<LocationLocationResponse["data"]>([]);
</script>

<template>
  <div class="space-y-4 @container">
    <CustomPageTitle>
      <Icon name="lucide:shield-plus" />
      បង្កើតព័ត៌មានអង្គភាពថ្មី
    </CustomPageTitle>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="grid gap-2 required-field">
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

      <div class="grid gap-2 required-field">
        <Label for="edu_level_id">ភូមិសិក្សា</Label>
        <CustomComboboxWithList
          button-class="w-full"
          id="edu_level_id"
          :model-value="values.edu_level_id!"
          @update:model-value="(value) => setFieldValue('edu_level_id', value!)"
          :options="locationLevels?.data ?? []"
          placeholder="ជ្រើសរើសភូមិសិក្សា"
          search-placeholder="ជ្រើសរើសភូមិសិក្សា..."
        />
      </div>
    </div>
    <div
      class="border-y py-4 border-primary/30 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      <div class="grid gap-2 required-field">
        <Label for="location-province">ក្រសួង/ខេត្ត </Label>
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

      <div class="grid gap-2 required-field">
        <Label for="location-district">ស្រុក/ខណ្ឌ/ក្រុង </Label>
        <CustomComboboxWithList
          button-class="w-full"
          id="location-district"
          :model-value="values.locationDistrict!"
          @update:model-value="(value) => setFieldValue('locationDistrict', value!)"
          :refetch-base-on="values.locationProvince?.value"
          :options="locationDistricts"
          placeholder="ជ្រើសរើសស្រុក/ខណ្ឌ/ក្រុង"
          search-placeholder="ជ្រើសរើសស្រុក/ខណ្ឌ/ក្រុង..."
        />
      </div>

      <div class="grid gap-2 required-field">
        <Label for="location-commune">ឃុំ/សង្កាត់ </Label>
        <CustomComboboxWithList
          button-class="w-full"
          id="location-commune"
          :model-value="values.locationCommune!"
          @update:model-value="(value) => setFieldValue('locationCommune', value!)"
          :refetch-base-on="values.locationDistrict?.value"
          :options="locationCommunes"
          placeholder="ជ្រើសរើសឃុំ/សង្កាត់"
          search-placeholder="ជ្រើសរើសឃុំ/សង្កាត់..."
        />
      </div>

      <div class="grid gap-2 required-field">
        <Label for="location-village">ភូមិ </Label>
        <CustomComboboxWithList
          button-class="w-full"
          id="location-village"
          :model-value="values.locationVillage!"
          @update:model-value="(value) => setFieldValue('locationVillage', value!)"
          :refetch-base-on="values.locationCommune?.value"
          :options="locationVillages"
          placeholder="ជ្រើសរើសភូមិ"
          search-placeholder="ជ្រើសរើសភូមិ..."
        />
      </div>
    </div>

    <div
      class="grid gap-4 grid-cols-1 @sm:grid-cols-[1fr_auto] @lg:grid-cols-[auto_auto_1fr] items-start"
    >
      <div class="grid gap-2 w-fit required-field">
        <div class="flex items-center justify-between">
          <Label for="school-id">លេខកូដអង្គភាព </Label>
          <div
            v-if="values.trailingLocationCode && values.locationVillage?.id"
            class="text-sm leading-0"
          >
            <span v-if="isLoading">
              <Icon name="svg-spinners:180-ring-with-bg" />
            </span>
            <span
              v-else-if="
                !isLoading && (!trailingErrors || trailingErrors?.length <= 0)
              "
            >
              <Icon name="lucide:circle-check-big" class="text-green-500" />
            </span>
            <span v-else>
              <Icon name="lucide:circle-alert" class="text-red-500" />
            </span>
          </div>
        </div>
        <div
          v-if="ArrayOfVillageId!.length > 0"
          class="flex items-center gap-2"
        >
          <SimpleOrgCode v-for="num in ArrayOfVillageId" :key="num"
            >{{ num }}
          </SimpleOrgCode>
          <Input
            id="school-id"
            class="max-w-20"
            type="text"
            inputmode="numeric"
            v-maska="'###'"
            placeholder="000"
            :model-value="values.trailingLocationCode!"
            @update:model-value="(value) => setFieldValue('trailingLocationCode', value as string)"
            @blur="customBlur"
          />
        </div>
        <label
          for="school-id"
          v-if="errors.trailingLocationCode"
          class="text-sm text-red-500"
        >
          {{ errors.trailingLocationCode }}</label
        >
      </div>
      <div
        class="grid gap-2 justify-items-start @sm:justify-items-end @lg:justify-items-center"
      >
        <Label for="emergency-code">លេខកូដបណ្ដោះអាសន្ន</Label>
        <Checkbox
          :model-value="values.toggleEmergencyCode"
          @update:model-value="(value) => setFieldValue('toggleEmergencyCode', value as boolean)"
          id="emergency-code"
          class="size-5 md:size-6"
        />
      </div>
      <div
        :class="values.toggleEmergencyCode ? 'required-field' : ''"
        class="grid gap-2 @sm:col-span-2 @lg:col-span-1"
      >
        <Label for="emis-code">លេខកូដ EMIS</Label>
        <Input
          :placeholder="
            values.toggleEmergencyCode
              ? 'សូមបញ្ចូលលេខកូដ EMIS...'
              : 'សូមបើកលេខកូដបណ្ដោះអាសន្ន EMIS ជាមុនសិន!'
          "
          :disabled="!values.toggleEmergencyCode"
          id="emis-code"
          type="text"
          :model-value="values.emergencyCode!"
          @update:model-value="(value) => setFieldValue('emergencyCode', value as string)"
        />
      </div>
    </div>

    <div class="grid gap-4 grid-cols-1 @lg:grid-cols-2 items-start">
      <div class="grid gap-2 required-field">
        <Label for="org-name">ឈ្មោះអង្គភាព </Label>
        <Input
          id="org-name"
          type="text"
          placeholder="សូមបញ្ចូលឈ្មោះអង្គភាព..."
          :model-value="values.schoolNameKH"
          @update:model-value="(value) => setFieldValue('schoolNameKH', value as string)"
        />
      </div>
      <div class="grid gap-2">
        <Label for="org-name-en">ឈ្មោះអង្គភាព (ឡាតាំង)</Label>
        <Input
          id="org-name-en"
          type="text"
          placeholder="សូមបញ្ចូលឈ្មោះអង្គភាពជាឡាតាំង..."
          :model-value="values.schoolNameEN"
          @update:model-value="(value) => setFieldValue('schoolNameEN', value as string)"
        />
      </div>
    </div>

    <div
      class="grid gap-4 grid-cols-1 @sm:grid-cols-[1fr_auto] @lg:grid-cols-[1fr_auto_1fr] items-start"
    >
      <div class="grid gap-2 w-full">
        <Label for="school-location">ស្ថិតក្នុងកម្រងសាលា/សាលាបណ្ដាញ</Label>
        <CustomComboboxWithList
          button-class="w-full"
          id="school-location"
          :model-value="values.locationLocation!"
          @update:model-value="(value) => setFieldValue('locationLocation', value!)"
          :refetch-base-on="values.locationCommune?.value"
          :options="locationLocations"
          placeholder="ជ្រើសរើសទីតាំងសាលា"
          search-placeholder="ជ្រើសរើសទីតាំង..."
        />
      </div>
      <div
        class="grid gap-2 justify-items-start @sm:justify-items-end @lg:justify-items-center"
      >
        <Label for="school-relate">សាលាឧបសម្ព័ន?</Label>
        <div class="flex gap-2 items-center">
          <Checkbox
            :model-value="values.toggleSchoolAnnex"
            @update:model-value="(value) => setFieldValue('toggleSchoolAnnex', value as boolean)"
            id="school-relate"
            class="size-5 md:size-6"
          />
          <Label for="school-relate">មាន</Label>
        </div>
      </div>
      <div class="grid gap-2 @sm:col-span-2 @lg:col-span-1">
        <Label for="school-relate-location">សាលាបង្គោល</Label>
        <CustomComboboxWithList
          button-class="w-full"
          id="school-relate-location"
          :model-value="values.locationSchoolRelate!"
          @update:model-value="(value) => setFieldValue('locationSchoolRelate', value!)"
          :refetch-base-on="values.locationCommune?.value"
          :options="locationLocations"
          placeholder="ជ្រើសរើសទីតាំងសាលាបង្គោល"
          search-placeholder="ជ្រើសរើសទីតាំងសាលាបង្គោល..."
        />
      </div>
    </div>

    <div
      class="border-y py-4 border-primary/30 grid gap-4 grid-cols-1 md:grid-cols-[1fr_auto] lg:grid-cols-[1fr_1fr_auto] items-center"
    >
      <div class="grid gap-2">
        <Label for="location-region">ប្រភេទតំបន់</Label>
        <CustomComboboxWithList
          button-class="w-full"
          id="location-region"
          :model-value="values.locationRegion!"
          @update:model-value="(value) => setFieldValue('locationRegion', value!)"
          :options="locationRegions?.data ?? []"
          placeholder="ជ្រើសរើសប្រភេទតំបន់"
          search-placeholder="ជ្រើសរើសប្រភេទតំបន់..."
        />
      </div>

      <div class="grid gap-2">
        <Label for="location-level">សាលាច្រើនកម្រិត</Label>
        <CustomComboboxWithList
          button-class="w-full"
          id="location-level"
          :model-value="values.locationLevel!"
          @update:model-value="(value) => setFieldValue('locationLevel', value!)"
          :options="locationLevels?.data ?? []"
          placeholder="ជ្រើសរើសកម្រិតរបស់សាលា"
          search-placeholder="ជ្រើសរើសកម្រិតរបស់សាលា..."
        />
      </div>

      <div class="flex items-center gap-2">
        <Checkbox
          :model-value="values.haveProblem"
          @update:model-value="(value) => setFieldValue('haveProblem', value as boolean)"
          id="have-problem"
          class="size-5 md:size-6"
        />
        <Label for="have-problem">ជួបការលំបាក</Label>
      </div>
    </div>

    <div class="grid gap-2">
      <Label for="school-history">ប្រវត្តិអង្គភាព</Label>
      <Textarea
        :model-value="values.schoolHistory"
        @update:model-value="(value) => setFieldValue('schoolHistory', value as string)"
        class="h-36 max-h-36 md:h-40 md:max-h-40"
        required
        placeholder="សូមបញ្ចូលប្រវត្តិ/សាវតារបស់អង្គភាព..."
      />
    </div>

    <div class="flex justify-center items-center gap-2 *:font-black">
      <!-- cancel button -->
      <Button variant="outline" @click="cancelForm">
        <Icon name="lucide:x" class="h-4 w-4" />
        បោះបង់
      </Button>
      <!-- submit button -->
      <Button v-if="isSubmitting" disabled>
        <Icon name="svg-spinners:180-ring-with-bg" class="h-4 w-4" />
        កំពុងរក្សាទុក...
      </Button>
      <Button v-else :disabled="!meta.valid" @click="submitForm">
        <Icon name="lucide:save" class="h-4 w-4" />
        រក្សាទុក
      </Button>
    </div>
  </div>
</template>
