<script setup lang="ts">
import { useStaffCreateForm } from "~/composables/staff/useStaffCreateForm";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  middleware: ["location"],
});

use1EZSeo({
  title: `${defaultSeo.title} - Staff Create`,
  description:
    "You can create more information about staffs in this page to let them use the platform!",
});

const { create, cancelForm } = useStaffCreateForm();
const {
  meta,
  errors,
  fields,
  asyncData,
  submitForm,
  isSubmitting,
  defaultValues,
  salaryLevelGrades1,
  salaryLevelGrades2,
} = create();

await asyncData;

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

const sectionClasses: string =
  "direct-parent:@container/main @container/side grid gap-4 items-start grid-cols-1 @[64rem]/main:grid-cols-[1fr_auto_1fr]";
const sideClasses: string =
  "grid gap-4 items-start grid-cols-1 @[38rem]/side:grid-cols-2";
</script>

<template>
  <div class="space-y-4 @container">
    <CustomPageTitle>
      <Icon name="lucide:user-round-plus" />
      បង្កើតព័ត៌មានបុគ្គលិកថ្មី
    </CustomPageTitle>
    <!-- each section -->
    <Card class="py-4 *:px-4 gap-4">
      <CardHeader class="gap-0">
        <CardTitle class="text-primary text-lg text-left font-semibold">
          ព័ត៌មានទូទៅ
        </CardTitle>
      </CardHeader>
      <CardContent :class="sectionClasses">
        <div id="self" :class="sideClasses">
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="payroll_id">អត្តលេខមន្ត្រី</Label>
            <Input
              id="payroll_id"
              type="number"
              placeholder="សូមបញ្ចូលអត្តលេខមន្ត្រី..."
              v-model:model-value="fields.payroll_id.model.value"
              v-bind="fields.payroll_id.props"
            />
            <small class="text-red-500">{{ errors.payroll_id }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="staff_dob">ថ្ងៃ ខែ ឆ្នាំកំណើត</Label>
            <CustomDateField
              id="staff_dob"
              v-model="fields.staff_dob.model.value"
              v-bind="fields.staff_dob.props"
            />
            <small class="text-red-500">{{ errors.staff_dob }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="staff_name">ឈ្មោះជាភាសាខ្មែរ</Label>
            <Input
              id="staff_name"
              type="text"
              placeholder="សូមបញ្ចូលឈ្មោះជាភាសាខ្មែរ..."
              v-model:model-value="fields.staff_name.model.value"
              v-bind="fields.staff_name.props"
            />
            <small class="text-red-500">{{ errors.staff_name }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="staff_gender">ភេទ</Label>
            <CustomComboboxWithList
              id="staff_gender"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសភេទ..."
              search-placeholder="សូមជ្រើសរើសភេទ..."
              :options="defaultValues?.genders ?? []"
              v-model="fields.staff_gender.model.value"
              v-bind="fields.staff_gender.props"
            />
            <small class="text-red-500">{{ errors.staff_gender }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2">
            <Label for="staff_name_en">ឈ្មោះជាឡាតាំង</Label>
            <Input
              id="staff_name_en"
              type="text"
              placeholder="សូមបញ្ចូលឈ្មោះជាឡាតាំង..."
            />
            <small class="text-red-500"></small>
          </div>
        </div>
        <Separator class="block @[64rem]/main:hidden bg-primary/30" />
        <Separator
          class="hidden @[64rem]/main:block bg-primary/30"
          orientation="vertical"
        />
        <div id="other" :class="sideClasses">
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="staff_account_number">លេខគណនីបៀវត្ស</Label>
            <Input
              id="staff_account_number"
              type="text"
              inputmode="numeric"
              v-maska="'####-########-##'"
              placeholder="សូមបញ្ចូលលេខគណនីបៀវត្ស..."
              @maska="
                fields.staff_account_number.model.value = $event.detail.unmasked
              "
              :model-value="fields.staff_account_number.model.value"
              v-bind="fields.staff_account_number.props"
            />
            <small class="text-red-500">{{
              errors.staff_account_number
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2">
            <Label for="staff_email">E-mail</Label>
            <Input
              id="staff_email"
              type="email"
              placeholder="សូមបញ្ចូល E-mail..."
              v-model:model-value="fields.staff_email.model.value!"
              v-bind="fields.staff_email.props"
            />
            <small class="text-red-500">{{ errors.staff_email }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="staff_phone">លេខទូរសព្ទ</Label>
            <Input
              id="staff_phone"
              type="tel"
              placeholder="សូមបញ្ចូលលេខទូរសព្ទ..."
              v-model:model-value="fields.staff_phone.model.value"
              v-bind="fields.staff_phone.props"
            />
            <small class="text-red-500">{{ errors.staff_phone }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="status_id">ស្ថានភាពការងារ</Label>
            <CustomComboboxWithList
              id="status_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសស្ថានភាពការងារ..."
              search-placeholder="សូមជ្រើសរើសស្ថានភាពការងារ..."
              :options="defaultValues?.statuses ?? []"
              v-model="fields.status_id.model.value"
              v-bind="fields.status_id.props"
            />
            <small class="text-red-500">{{ errors.status_id }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="position_id">មុខតំណែង</Label>
            <CustomComboboxWithList
              id="position_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសមុខតំណែង!..."
              search-placeholder="សូមជ្រើសរើសមុខតំណែង!..."
              :options="defaultValues?.positions ?? []"
              v-model="fields.position_id.model.value"
              v-bind="fields.position_id.props"
            />
            <small class="text-red-500">{{ errors.position_id }}</small>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- each section -->
    <Card class="py-4 *:px-4 gap-4">
      <CardHeader class="gap-0">
        <CardTitle class="text-primary text-lg text-left font-semibold">
          កម្រិតវប្បធម៌
        </CardTitle>
      </CardHeader>
      <CardContent :class="sectionClasses">
        <div id="grade-12" :class="sideClasses">
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="start_qualification_id">ចំណេះទូទៅ (ត្រឹមបាក់ឌុប)</Label>
            <CustomComboboxWithList
              id="start_qualification_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសចំណេះទូទៅ (ត្រឹមបាក់ឌុប)..."
              search-placeholder="សូមជ្រើសរើសចំណេះទូទៅ (ត្រឹមបាក់ឌុប)..."
              :options="defaultValues?.qualificationsBacii ?? []"
              v-model="fields.start_qualification_id.model.value"
              v-bind="fields.start_qualification_id.props"
            />
            <small class="text-red-500">{{
              errors.start_qualification_id
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="start_qualification_date">ថ្ងៃ ខែ ឆ្នាំបញ្ចប់</Label>
            <CustomDateField
              id="start_qualification_date"
              v-model="fields.start_qualification_date.model.value"
              v-bind="fields.start_qualification_date.props"
            />
            <small class="text-red-500">{{
              errors.start_qualification_date
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="start_qualification_institution_id"
              >គ្រឹះស្ថានបណ្ដុះបណ្ដាល</Label
            >
            <CustomComboboxWithList
              id="start_qualification_institution_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសគ្រឹះស្ថានបណ្ដុះបណ្ដាល..."
              search-placeholder="សូមជ្រើសរើសគ្រឹះស្ថានបណ្ដុះបណ្ដាល..."
              :options="defaultValues?.institutions ?? []"
              v-model="fields.start_qualification_institution_id.model.value"
              v-bind="fields.start_qualification_institution_id.props"
            />
            <small class="text-red-500">{{
              errors.start_qualification_institution_id
            }}</small>
          </div>
        </div>
        <Separator class="block @[64rem]/main:hidden bg-primary/30" />
        <Separator
          class="hidden @[64rem]/main:block bg-primary/30"
          orientation="vertical"
        />
        <div id="higher-edu" :class="sideClasses">
          <!-- each input -->
          <div class="grid gap-2">
            <Label for="current_qualification_id">ឧត្តមសិក្សា (ចុងក្រោយ)</Label>
            <CustomComboboxWithList
              id="current_qualification_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសឧត្តមសិក្សា (ចុងក្រោយ)..."
              search-placeholder="សូមជ្រើសរើសឧត្តមសិក្សា (ចុងក្រោយ)..."
              :options="defaultValues?.qualifications ?? []"
              v-model="fields.current_qualification_id.model.value!"
              v-bind="fields.current_qualification_id.props"
            />
            <small class="text-red-500">{{
              errors.current_qualification_id
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2">
            <Label for="current_qualification_date">ថ្ងៃ ខែ ឆ្នាំបញ្ចប់</Label>
            <CustomDateField
              id="current_qualification_date"
              v-model="fields.current_qualification_date.model.value!"
              v-bind="fields.current_qualification_date.props"
            />
            <small class="text-red-500">{{
              errors.current_qualification_date
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2">
            <Label for="current_qualification_subject_id">ឯកទេស</Label>
            <CustomComboboxWithList
              id="current_qualification_subject_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសឯកទេស..."
              search-placeholder="សូមជ្រើសរើសឯកទេស..."
              :options="defaultValues?.subjects ?? []"
              v-model="fields.current_qualification_subject_id.model.value!"
              v-bind="fields.current_qualification_subject_id.props"
            />
            <small class="text-red-500">{{
              errors.current_qualification_subject_id
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2">
            <Label for="current_qualification_institution_id"
              >គ្រឹះស្ថានបណ្ដុះបណ្ដាល</Label
            >
            <CustomComboboxWithList
              id="current_qualification_institution_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសគ្រឹះស្ថានបណ្ដុះបណ្ដាល..."
              search-placeholder="សូមជ្រើសរើសគ្រឹះស្ថានបណ្ដុះបណ្ដាល..."
              :options="defaultValues?.institutions ?? []"
              v-model="fields.current_qualification_institution_id.model.value!"
              v-bind="fields.current_qualification_institution_id.props"
            />
            <small class="text-red-500">{{
              errors.current_qualification_institution_id
            }}</small>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- each section -->
    <Card class="py-4 *:px-4 gap-4">
      <CardHeader class="gap-0">
        <CardTitle class="text-primary text-lg text-left font-semibold">
          កម្រិតជំនាញ
        </CardTitle>
      </CardHeader>
      <CardContent :class="sectionClasses">
        <div id="first" :class="sideClasses">
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="start_professional_id">កម្រិតជំនាញ (ចាប់ផ្ដើម)</Label>
            <CustomComboboxWithList
              id="start_professional_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសកម្រិតជំនាញ..."
              search-placeholder="សូមជ្រើសរើសកម្រិតជំនាញ..."
              :options="defaultValues?.professionals ?? []"
              v-model="fields.start_professional_id.model.value"
              v-bind="fields.start_professional_id.props"
            />
            <small class="text-red-500">{{
              errors.start_professional_id
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="start_professional_type_id">ប្រព័ន្ធបណ្ដុះបណ្ដាល</Label>
            <CustomComboboxWithList
              id="start_professional_type_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសប្រព័ន្ធបណ្ដុះបណ្ដាល..."
              search-placeholder="សូមជ្រើសរើសប្រព័ន្ធបណ្ដុះបណ្ដាល..."
              :options="defaultValues?.professionalTypes ?? []"
              v-model="fields.start_professional_type_id.model.value"
              v-bind="fields.start_professional_type_id.props"
            />
            <small class="text-red-500">{{
              errors.start_professional_type_id
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="start_professional_date"
              >ថ្ងៃ ខែ​ ឆ្នាំចាប់ផ្ដើម (ចាប់ផ្ដើម)</Label
            >
            <CustomDateField
              id="start_professional_date"
              v-model="fields.start_professional_date.model.value"
              v-bind="fields.start_professional_date.props"
            />
            <small class="text-red-500">{{
              errors.start_professional_date
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="start_professional_subject_id_1">ឯកទេសទី១</Label>
            <CustomComboboxWithList
              id="start_professional_subject_id_1"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសឯកទេស..."
              search-placeholder="សូមជ្រើសរើសឯកទេស..."
              :options="defaultValues?.subjects ?? []"
              v-model="fields.start_professional_subject_id_1.model.value"
              v-bind="fields.start_professional_subject_id_1.props"
            />
            <small class="text-red-500">{{
              errors.start_professional_subject_id_1
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="start_professional_institution_id"
              >គ្រឹះស្ថានបណ្ដុះបណ្ដាល</Label
            >
            <CustomComboboxWithList
              id="start_professional_institution_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសគ្រឹះស្ថានបណ្ដុះបណ្ដាល..."
              search-placeholder="សូមជ្រើសរើសគ្រឹះស្ថានបណ្ដុះបណ្ដាល..."
              :options="defaultValues?.institutions ?? []"
              v-model="fields.start_professional_institution_id.model.value"
              v-bind="fields.start_professional_institution_id.props"
            />
            <small class="text-red-500">{{
              errors.start_professional_institution_id
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2">
            <Label for="start_professional_subject_id_2">ឯកទេសទី២</Label>
            <CustomComboboxWithList
              id="start_professional_subject_id_2"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសឯកទេស..."
              search-placeholder="សូមជ្រើសរើសឯកទេស..."
              :options="defaultValues?.subjects ?? []"
              v-model="fields.start_professional_subject_id_2.model.value!"
              v-bind="fields.start_professional_subject_id_2.props"
            />
            <small class="text-red-500">{{
              errors.start_professional_subject_id_2
            }}</small>
          </div>
        </div>
        <Separator class="block @[64rem]/main:hidden bg-primary/30" />
        <Separator
          class="hidden @[64rem]/main:block bg-primary/30"
          orientation="vertical"
        />
        <div id="last" :class="sideClasses">
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="current_professional_id">កម្រិតជំនាញ (ចុងក្រោយ)</Label>
            <CustomComboboxWithList
              id="current_professional_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសកម្រិតជំនាញ..."
              search-placeholder="សូមជ្រើសរើសកម្រិតជំនាញ..."
              :options="defaultValues?.professionals ?? []"
              v-model="fields.current_professional_id.model.value"
              v-bind="fields.current_professional_id.props"
            />
            <small class="text-red-500">{{
              errors.current_professional_id
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="current_professional_type_id"
              >ប្រព័ន្ធបណ្ដុះបណ្ដាល</Label
            >
            <CustomComboboxWithList
              id="current_professional_type_id"
              button-class="w-full"
              placeholder="សូមបញ្ចូលប្រព័ន្ធបណ្ដុះបណ្ដាល..."
              search-placeholder="សូមបញ្ចូលប្រព័ន្ធបណ្ដុះបណ្ដាល..."
              :options="defaultValues?.professionalTypes ?? []"
              v-model="fields.current_professional_type_id.model.value"
              v-bind="fields.current_professional_type_id.props"
            />
            <small class="text-red-500">{{
              errors.current_professional_type_id
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="current_professional_date"
              >ថ្ងៃ ខែ ឆ្នាំចាប់ផ្ដើម</Label
            >
            <CustomDateField
              id="current_professional_date"
              v-model="fields.current_professional_date.model.value"
              v-bind="fields.current_professional_date.props"
            />
            <small class="text-red-500">{{
              errors.current_professional_date
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="current_professional_subject_id_1">ឯកទេសទី១</Label>
            <CustomComboboxWithList
              id="current_professional_subject_id_1"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសឯកទេស..."
              search-placeholder="សូមជ្រើសរើសឯកទេស..."
              :options="defaultValues?.subjects ?? []"
              v-model="fields.current_professional_subject_id_1.model.value"
              v-bind="fields.current_professional_subject_id_1.props"
            />

            <small class="text-red-500">{{
              errors.current_professional_subject_id_1
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="current_professional_institution_id"
              >គ្រឹះស្ថានបណ្ដុះបណ្ដាល</Label
            >
            <CustomComboboxWithList
              id="current_professional_institution_id"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសគ្រឹះស្ថានបណ្ដុះបណ្ដាល..."
              search-placeholder="សូមជ្រើសរើសគ្រឹះស្ថានបណ្ដុះបណ្ដាល..."
              :options="defaultValues?.institutions ?? []"
              v-model="fields.current_professional_institution_id.model.value"
              v-bind="fields.current_professional_institution_id.props"
            />
            <small class="text-red-500">{{
              errors.current_professional_institution_id
            }}</small>
          </div>
          <!-- each input -->
          <div class="grid gap-2">
            <Label for="current_professional_subject_id_2">ឯកទេសទី២</Label>
            <CustomComboboxWithList
              id="current_professional_subject_id_2"
              button-class="w-full"
              placeholder="សូមជ្រើសរើសឯកទេស..."
              search-placeholder="សូមជ្រើសរើសឯកទេស..."
              :options="defaultValues?.subjects ?? []"
              v-model="fields.current_professional_subject_id_2.model.value!"
              v-bind="fields.current_professional_subject_id_2.props"
            />

            <small class="text-red-500">{{
              errors.current_professional_subject_id_2
            }}</small>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- each section -->
    <Card class="py-4 *:px-4 gap-4">
      <CardHeader class="gap-0">
        <CardTitle class="text-primary text-lg text-left font-semibold">
          ស្ថានភាពមុខងារ
        </CardTitle>
      </CardHeader>
      <CardContent :class="sectionClasses">
        <div id="framework" :class="sideClasses">
          <!-- each input double -->
          <div class="@container/field">
            <div
              class="grid gap-4 grid-cols-1 @sm/field:grid-cols-2 required-field"
            >
              <div class="grid gap-2 w-full">
                <Label for="start_salary_level_id"
                  >ប្រភេទកាំប្រាក់ (ចាប់ផ្ដើម)</Label
                >
                <CustomComboboxWithList
                  button-class="w-full overflow-hidden"
                  id="start_salary_level_id"
                  placeholder="ប្រ.កាំប្រាក់"
                  search-placeholder="ប្រ.កាំប្រាក់..."
                  :options="defaultValues?.salaryLevels ?? []"
                  v-model="fields.start_salary_level_id.model.value"
                  v-bind="fields.start_salary_level_id.props"
                />
                <small class="text-red-500">{{
                  errors.start_salary_level_id
                }}</small>
              </div>
              <div class="grid gap-2 w-full">
                <Label for="start_salary_degree">ថ្នាក់</Label>
                <CustomComboboxWithList
                  button-class="w-full overflow-hidden"
                  id="start_salary_degree"
                  placeholder="ថ្នាក់..."
                  search-placeholder="ថ្នាក់..."
                  :options="salaryLevelGrades1 ?? []"
                  v-model="fields.start_salary_degree.model.value"
                  v-bind="fields.start_salary_degree.props"
                />
                <small class="text-red-500">{{
                  errors.start_salary_degree
                }}</small>
              </div>
            </div>
          </div>

          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="start_salary_date">ថ្ងៃ ខែ ឆ្នាំទទួលបាន</Label>
            <CustomDateField
              id="start_salary_date"
              v-model="fields.start_salary_date.model.value"
              v-bind="fields.start_salary_date.props"
            />
            <small class="text-red-500">{{ errors.start_salary_date }}</small>
          </div>
        </div>
        <Separator class="block @[64rem]/main:hidden bg-primary/30" />
        <Separator
          class="hidden @[64rem]/main:block bg-primary/30"
          orientation="vertical"
        />
        <div id="position" :class="sideClasses">
          <!-- each input double -->
          <div class="@container/field">
            <div
              class="grid gap-4 grid-cols-1 @sm/field:grid-cols-2 required-field"
            >
              <div class="grid gap-2 w-full">
                <Label for="current_salary_level_id"
                  >ប្រភេទកាំប្រាក់ (បច្ចុប្បន្ន)</Label
                >
                <CustomComboboxWithList
                  button-class="w-full overflow-hidden"
                  id="current_salary_level_id"
                  placeholder="ប្រ.កាំប្រាក់"
                  search-placeholder="ប្រ.កាំប្រាក់..."
                  :options="defaultValues?.salaryLevels ?? []"
                  v-model="fields.current_salary_level_id.model.value"
                  v-bind="fields.current_salary_level_id.props"
                />
                <small class="text-red-500">{{
                  errors.current_salary_level_id
                }}</small>
              </div>
              <div class="grid gap-2 w-full">
                <Label for="current_salary_degree">ថ្នាក់</Label>
                <CustomComboboxWithList
                  button-class="w-full overflow-hidden"
                  id="current_salary_degree"
                  placeholder="ថ្នាក់..."
                  search-placeholder="ថ្នាក់..."
                  :options="salaryLevelGrades2 ?? []"
                  v-model="fields.current_salary_degree.model.value"
                  v-bind="fields.current_salary_degree.props"
                />
                <small class="text-red-500">{{
                  errors.current_salary_degree
                }}</small>
              </div>
            </div>
          </div>

          <!-- each input -->
          <div class="grid gap-2 required-field">
            <Label for="current_salary_date">ថ្ងៃ ខែ ឆ្នាំទទួលបាន</Label>
            <CustomDateField
              id="current_salary_date"
              v-model="fields.current_salary_date.model.value"
              v-bind="fields.current_salary_date.props"
            />
            <small class="text-red-500">{{ errors.current_salary_date }}</small>
          </div>
        </div>
      </CardContent>
    </Card>
    <!-- submission -->
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
