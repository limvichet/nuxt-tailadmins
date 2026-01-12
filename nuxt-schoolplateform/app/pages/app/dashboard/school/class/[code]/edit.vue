<script setup lang="ts">
import { useClassUpdateForm } from "~/composables/school/class/useClassUpdateForm";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
  middleware: ["location"],
});

const { code } = useRoute().params;

use1EZSeo({
  title: `${defaultSeo.title} - ${code} Edit`,
  description: `This is the editing page for class with code ${code}.`,
});

const { update, cancelForm } = useClassUpdateForm(code);
const {
  meta,
  errors,
  fields,
  loadData,
  asyncData,
  submitForm,
  isSubmitting,
  defaultValues,
} = update();

await loadData();

if (asyncData.error.value) {
  throw createError({
    statusCode: NOT_FOUND.code,
    statusMessage: "Can't update class without code!",
    fatal: true,
  });
}
</script>

<template>
  <div class="space-y-4 @container">
    <CustomPageTitle>
      <Icon name="lucide:house" />
      កែប្រែថ្នាក់រៀន
    </CustomPageTitle>

    <!-- each section -->
    <Card class="py-4 *:px-4 gap-4">
      <CardHeader class="gap-0">
        <CardTitle class="text-primary text-lg text-left font-semibold">
          ព័ត៌មានថ្នាក់រៀន
        </CardTitle>
      </CardHeader>
      <CardContent
        class="direct-parent:@container/main grid gap-4 items-start grid-cols-1 @[48rem]/main:grid-cols-2 @[64rem]/main:grid-cols-3"
      >
        <div class="grid gap-2 required-field">
          <Label for="academic">ឆ្នាំសិក្សា</Label>
          <CustomComboboxWithList
            id="academic"
            button-class="w-full"
            :options="defaultValues?.options?.academics ?? []"
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
            :options="defaultValues?.options?.grades ?? []"
            placeholder="ជ្រើសរើសកម្រិតថ្នាក់"
            search-placeholder="ជ្រើសរើសកម្រិតថ្នាក់..."
            v-model:model-value="fields.grade_id.model.value"
            v-bind="fields.grade_id.props"
          />
          <small class="text-red-500">{{ errors.grade_id }}</small>
        </div>

        <div class="grid gap-2 required-field">
          <Label for="grade_name">ឈ្មោះថ្នាក់</Label>
          <Input
            id="grade_name"
            placeholder="ថ្នាក់..."
            v-model:model-value="fields.grade_name.model.value"
            v-bind="fields.grade_name.props"
          />
          <small class="text-red-500">{{ errors.grade_name }}</small>
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
        កំពុងកែប្រែ...
      </Button>
      <Button v-else :disabled="!meta.valid" @click="submitForm">
        <Icon name="lucide:edit" class="h-4 w-4" />
        កែប្រែ
      </Button>
    </div>
  </div>
</template>
