<script setup lang="ts">
import { useCreateForm } from "~/composables/school/staff-teaching/create";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  middleware: ["location"],
});

use1EZSeo({
  title: `${defaultSeo.title} - Staff Teaching Create`,
  description: "You can create staff teaching data in this page for later use!",
});

const { create, cancelForm } = useCreateForm();
const {
  meta,
  errors,
  fields,
  asyncData,
  defaultValues,
  submitForm,
  isSubmitting,
} = create();
await asyncData;
</script>

<template>
  <div class="space-y-4 @container">
    <CustomPageTitle>
      <Icon name="lucide:user-round-plus" />
      បង្កើតព័ត៌មានបុគ្គលិកបង្រៀន
    </CustomPageTitle>

    <!-- each section -->
    <Card class="py-4 *:px-4 gap-4">
      <CardHeader class="gap-0">
        <CardTitle class="text-primary text-lg text-left font-semibold">
          ព័ត៌មានទូទៅ
        </CardTitle>
      </CardHeader>
      <CardContent class="direct-parent:@container/main">
        <form
          novalidate
          class="w-full grid gap-4 items-start grid-cols-1 @[48rem]/main:grid-cols-2 @[64rem]/main:grid-cols-3"
        >
          <div class="grid gap-2 required-field">
            <Label for="academic_id">ឆ្នាំសិក្សា</Label>
            <CustomComboboxWithList
              id="academic_id"
              button-class="w-full"
              :options="defaultValues?.academics ?? []"
              placeholder="ជ្រើសរើសឆ្នាំសិក្សា"
              search-placeholder="ជ្រើសរើសឆ្នាំសិក្សា..."
              v-model:model-value="fields.academic_id.model.value"
              v-bind="fields.academic_id.props"
            />
            <small class="text-red-500">{{ errors.academic_id }}</small>
          </div>

          <div class="grid gap-2 required-field">
            <Label for="staff_id">ឈ្មោះបុគ្គលិក</Label>
            <CustomComboboxWithList
              id="staff_id"
              button-class="w-full"
              :options="defaultValues?.staffs ?? []"
              placeholder="ជ្រើសរើសបុគ្គលិក"
              search-placeholder="ជ្រើសរើសបុគ្គលិក..."
              v-model:model-value="fields.staff_id.model.value"
              v-bind="fields.staff_id.props"
            />
            <small class="text-red-500">{{ errors.staff_id }}</small>
          </div>

          <div class="grid gap-2 required-field">
            <Label for="cgt_id">ប្រភេទកម្រិតថ្នាក់</Label>
            <CustomComboboxWithList
              id="cgt_id"
              button-class="w-full"
              :options="defaultValues?.grade_types ?? []"
              placeholder="ជ្រើសរើសប្រភេទកម្រិតថ្នាក់"
              search-placeholder="ជ្រើសរើសប្រភេទកម្រិតថ្នាក់..."
              v-model:model-value="fields.cgt_id.model.value"
              v-bind="fields.cgt_id.props"
            />
            <small class="text-red-500">{{ errors.cgt_id }}</small>
          </div>
        </form>
      </CardContent>
    </Card>

    <!-- each section -->
    <Card class="py-4 *:px-4 gap-4">
      <CardHeader class="gap-0">
        <CardTitle class="text-primary text-lg text-left font-semibold">
          ព័ត៌មានបន្ថែម
        </CardTitle>
      </CardHeader>
      <CardContent class="direct-parent:@container/main">
        <form
          novalidate
          class="w-full grid gap-6 items-start grid-cols-1 @[48rem]/main:grid-cols-2 @[64rem]/main:grid-cols-4 @[80rem]/main:grid-cols-6"
        >
          <div class="grid gap-4 grid-cols-[auto_1fr] items-center">
            <Checkbox
              id="add_teaching"
              class="scale-150"
              v-model:model-value="fields.add_teaching.model.value"
              v-bind="fields.add_teaching.props"
            />
            <Label for="add_teaching">ជួយបង្រៀន</Label>
          </div>

          <div class="grid gap-4 grid-cols-[auto_1fr] items-center">
            <Checkbox
              id="chief_technical"
              class="scale-150"
              v-model:model-value="fields.chief_technical.model.value"
              v-bind="fields.chief_technical.props"
            />
            <Label for="chief_technical">ប្រធានក្រុមបច្ចេកទេស</Label>
          </div>

          <div class="grid gap-4 grid-cols-[auto_1fr] items-center">
            <Checkbox
              id="bi_language"
              class="scale-150"
              v-model:model-value="fields.bi_language.model.value"
              v-bind="fields.bi_language.props"
            />
            <Label for="bi_language">ពីរភាសា</Label>
          </div>

          <div class="grid gap-4 grid-cols-[auto_1fr] items-center">
            <Checkbox
              id="teach_english"
              class="scale-150"
              v-model:model-value="fields.teach_english.model.value"
              v-bind="fields.teach_english.props"
            />
            <Label for="teach_english">បង្រៀនភាសាអង់គ្លេស</Label>
          </div>

          <div class="grid gap-4 grid-cols-[auto_1fr] items-center">
            <Checkbox
              id="class_incharge"
              class="scale-150"
              v-model:model-value="fields.class_incharge.model.value"
              v-bind="fields.class_incharge.props"
            />
            <Label for="class_incharge">ទទួលបន្ទុកថ្នាក់</Label>
          </div>
        </form>
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
