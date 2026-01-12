<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import type {
  LocationCommuneResponse,
  LocationDistrictResponse,
  LocationShowResponse,
  LocationUpdateBody,
  LocationUpdateResponse,
  LocationVillageResponse,
} from "~/types/location";
import { schoolCreateSchema, type SchoolCreateForm } from "~/schemas/location";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  validate({ params: { code } }) {
    return /^[0-9]{11}$/.test(code!.toString());
  },
});

const { code } = useRoute().params;
use1EZSeo({
  title: `${defaultSeo.title} - ${code} Edit`,
  description: `This is the editing page for school with code ${code}.`,
});

const headers = useRequestHeaders(["cookie"]);
const { data: defaultValues, error } = await useAsyncData(
  `school-${code}`,
  async () =>
    $fetch<LocationShowResponse>(`/api/location/location-show`, {
      headers,
      params: { code },
    })
);
if (error && error?.value?.statusCode) {
  throw createError({
    statusCode: error.value?.statusCode,
    statusMessage: "មិនមានព័ត៌មាននៅក្នុងប្រព័ន្ធ!",
    message: error.value?.message || "មិនមានព័ត៌មាននៅក្នុងប្រព័ន្ធ!",
    data: error.value?.data,
  });
}

// validation setup
const {
  handleSubmit,
  meta,
  errors,
  isSubmitting,
  values,
  setFieldValue,
  resetField,
} = useForm<SchoolCreateForm>({
  validationSchema: toTypedSchema(schoolCreateSchema),
  initialValues: {
    locationType: defaultValues.value?.data?.location_type_id ?? undefined,
    locationProvince: defaultValues.value?.data?.pro_code ?? undefined,
    locationDistrict: defaultValues.value?.data?.dis_code ?? undefined,
    locationCommune: defaultValues.value?.data?.com_code ?? undefined,
    locationVillage: defaultValues.value?.data?.vil_code ?? undefined,
    locationLocation: defaultValues.value?.data?.schoolclaster ?? undefined, // school claster
    locationSchoolRelate: defaultValues.value?.data?.main_school ?? undefined, // main school
    locationRegion: defaultValues.value?.data?.region_id ?? undefined,
    locationLevel: defaultValues.value?.data?.multi_level_edu ?? undefined,
    trailingLocationCode:
      defaultValues.value?.data?.location_code?.slice(-3) ?? "000",
    toggleEmergencyCode:
      defaultValues.value?.data?.temporary_code === 1 ? true : false,
    emergencyCode: defaultValues.value?.data?.temporary_code
      ? defaultValues.value?.data?.emis_code
      : null,
    schoolNameKH: defaultValues.value?.data?.location_kh ?? undefined,
    toggleSchoolAnnex:
      defaultValues.value?.data?.school_annex === 1 ? true : false,
    haveProblem: defaultValues.value?.data?.disadvantage === 1 ? true : false,
    schoolHistory: defaultValues.value?.data?.location_history ?? undefined,
    edu_level_id: defaultValues.value?.data?.edu_level_id ?? undefined,
  },
});

// dependent arrays based on form values
const locationDistricts = ref(defaultValues.value?.options?.districts ?? []);
const locationCommunes = ref(defaultValues.value?.options?.communes ?? []);
const locationVillages = ref(defaultValues.value?.options?.villages ?? []);

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
    if (newProvince) await handleFetchDistricts(newProvince?.id as string);
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
    if (newDistrict) await handleFetchCommunes(newDistrict?.id as string);
  }
);

watch(
  () => values.locationCommune!,
  async (newCommune) => {
    // When commune changes, reset dependent fields and fetch new data
    resetField("locationVillage");
    locationVillages.value = [];
    if (newCommune) await handleFetchVillages(newCommune?.id as string);
  }
);

// cancel form
const cancelForm = () => {
  useRouter().back();
};

const { user } = useAuth();
// form submission
const submitForm = handleSubmit(async (data, actions) => {
  const body = computed<LocationUpdateBody>(() => ({
    location_type_id: data.locationType?.id as number,
    pro_code: data.locationProvince?.id as string,
    dis_code: data.locationDistrict?.id as string,
    com_code: data.locationCommune?.id as string,
    vil_code: data.locationVillage?.id as string,
    location_code:
      data.locationVillage?.id.toString() +
      data.trailingLocationCode!.toString().padStart(3, "0").slice(0, 3),
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
    created_by: defaultValues.value?.data?.created_by as number,
    updated_by: user.value?.id as number,
    active: 1,
  }));

  try {
    const { ok } = await $fetch.raw<LocationUpdateResponse>(
      `/api/location/location/${defaultValues.value?.data?.location_code}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(toValue(body)),
      }
    );
    if (ok) toast.success("ការកែប្រែបានជោគជ័យ!");
    navigateTo("/app/dashboard/location/search");
  } catch (error: any) {
    toast.error(
      `${error?.response?.status} ការកែប្រែមិនជោគជ័យ! ${error?.data?.message}`
    );
    console.error("Creating school error: ", error.data);
  }
});
</script>

<template>
  <div class="space-y-4 @container">
    <CustomPageTitle>
      <Icon name="lucide:file-pen" />
      កែប្រែព័ត៌មានអង្គភាព
    </CustomPageTitle>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="grid gap-2 required-field">
        <Label for="location-type">ប្រភេទអង្គភាព</Label>
        <CustomComboboxWithList
          id="location-type"
          button-class="w-full"
          :model-value="values.locationType!"
          @update:model-value="(value) => setFieldValue('locationType', value!)"
          :options="defaultValues?.options?.location_type ?? []"
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
          :options="defaultValues?.options?.levels ?? []"
          placeholder="ជ្រើសរើសភូមិសិក្សា"
          search-placeholder="ជ្រើសរើសភូមិសិក្សា..."
        />
      </div>
    </div>
    <div
      class="border-y py-4 border-primary/30 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      <div class="grid gap-2">
        <Label for="location-province required-field">ក្រសួង/ខេត្ត </Label>
        <CustomComboboxWithList
          button-class="w-full"
          id="location-province"
          :model-value="values.locationProvince!"
          @update:model-value="(value) => setFieldValue('locationProvince', value!)"
          :options="defaultValues?.options?.provinces ?? []"
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
          :options="locationDistricts ?? []"
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
          :options="locationCommunes ?? []"
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
          :options="locationVillages ?? []"
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
        </div>
        <div
          v-if="ArrayOfVillageId!.length > 0"
          class="flex items-center gap-2"
        >
          <SimpleOrgCode v-for="num in ArrayOfVillageId" :key="num"
            >{{ num }}
          </SimpleOrgCode>
          <SimpleOrgCode>
            {{ values.trailingLocationCode }}
          </SimpleOrgCode>
          <!-- <Input
            disabled
            id="school-id"
            class="max-w-20"
            type="number"
            min="1"
            max="999"
            placeholder="000"
            :model-value="values.trailingLocationCode!"
            @update:model-value="(value) => setFieldValue('trailingLocationCode', value as number)"
          /> -->
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
          :options="defaultValues?.options?.locations ?? []"
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
          :options="defaultValues?.options?.locations ?? []"
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
          :options="defaultValues?.options?.regions ?? []"
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
          :options="defaultValues?.options?.levels ?? []"
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
        កំពុងកែប្រែ...
      </Button>
      <Button v-else :disabled="!meta.valid" @click="submitForm">
        <Icon name="lucide:edit" class="h-4 w-4" />
        កែប្រែ
      </Button>
    </div>
  </div>
</template>
