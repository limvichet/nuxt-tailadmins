<script setup lang="ts">
import { useClassCreateForm } from "~/composables/school/class/useClassCreateForm";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  middleware: ["location"],
});

use1EZSeo({
  title: `${defaultSeo.title} - Class Create`,
  description:
    "You can create classrooms in this page to let them use the platform!",
});

const { create, cancelForm } = useClassCreateForm();
const {
  meta,
  errors,
  fields,
  asyncData,
  defaultValues,
  submitForm,
  isSubmitting,
  onGradeNameChange,
} = create();
await asyncData;
</script>

<template>
  <div class="space-y-4 @container">
    <CustomPageTitle>
      <Icon name="lucide:house-plus" />
      បង្កើតថ្នាក់រៀនថ្មី
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
          class="w-full grid gap-4 items-start grid-cols-1 @[48rem]/main:grid-cols-2"
        >
          <div class="grid gap-2 required-field">
            <Label for="academic">ឆ្នាំសិក្សា</Label>
            <CustomComboboxWithList
              id="academic"
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
            <Label for="grade">កម្រិតថ្នាក់</Label>
            <CustomComboboxWithList
              id="grade"
              button-class="w-full"
              :options="defaultValues?.grades ?? []"
              placeholder="ជ្រើសរើសកម្រិតថ្នាក់"
              search-placeholder="ជ្រើសរើសកម្រិតថ្នាក់..."
              v-model:model-value="fields.grade_id.model.value"
              v-bind="fields.grade_id.props"
            />
            <small class="text-red-500">{{ errors.grade_id }}</small>
          </div>
        </form>
      </CardContent>
    </Card>

    <!-- each section -->
    <Card class="py-4 *:px-4 gap-4">
      <CardHeader class="gap-0">
        <CardTitle class="text-primary text-lg text-left font-semibold">
          កំណត់ឈ្មោះថ្នាក់
        </CardTitle>
      </CardHeader>
      <CardContent class="direct-parent:@container/main space-y-4">
        <form
          novalidate
          class="w-full grid gap-4 items-start grid-cols-4 @[48rem]/main:grid-cols-8 @[64rem]/main:grid-cols-10 @[96rem]/main:grid-cols-12"
        >
          <Input
            v-for="(eachClass, index) in fields.grade_name.model.value"
            :key="`class-${index}`"
            placeholder="ថ្នាក់..."
            :model-value="eachClass"
            @update:model-value="(value) => onGradeNameChange(index, value as string)"
            v-bind="fields.grade_name.props"
          />
        </form>
        <small class="text-red-500">{{ errors.grade_name }}</small>
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
