<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { chPWSchema, type chPWForm } from "~/schemas/auth";

definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - Account`,
  description:
    "This is your account page where you can change your password and more!",
});

// change password form
const { handleSubmit, isSubmitting, meta, errors, defineField } =
  useForm<chPWForm>({
    validationSchema: toTypedSchema(chPWSchema),
  });
const opts = {
  validateOnModelUpdate: true,
};
const [oldpw, oldpwAttr] = defineField("current_password", opts);
const [newpw, newpwAttr] = defineField("new_password", opts);
const [connewpw, connewpwAttr] = defineField("new_password_confirmation", opts);

// form submission
const submitForm = handleSubmit(async (data, actions) => {
  const headers = useRequestHeaders(["cookie"]);
  try {
    const { ok } = await $fetch.raw("/api/auth/change-password", {
      method: "POST",
      headers,
      body: JSON.stringify(toValue(() => data)),
    });
    if (ok) toast.success("ការផ្លាស់ប្ដូរលេខសម្ងាត់បានជោគជ័យ!");
    actions.resetForm();
  } catch (error: any) {
    toast.error(
      `${error?.response?.status} ការផ្លាស់ប្ដូរលេខសម្ងាត់មានបញ្ហា! ${error?.data?.statusMessage}`
    );
  }
});
</script>

<template>
  <div class="space-y-4 @container">
    <!-- change password -->
    <Card class="bg-transparent w-full @md:max-w-sm py-4">
      <CardHeader class="px-4">
        <CardTitle class="text-xl text-left font-black"
          >ផ្លាស់ប្ដូរលេខសម្ងាត់</CardTitle
        >
        <CardDescription class="text-left text-sm">
          សូមបញ្ចូលលេខសម្ងាត់ចាស់ និងថ្មីដើម្បីធ្វើការផ្លាស់ប្ដូរ!
        </CardDescription>
      </CardHeader>
      <CardContent class="px-4">
        <form @submit.prevent="submitForm" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="current_password">លេខសម្ងាត់ចាស់</Label>
            <PasswordInput
              v-model:password="oldpw"
              v-bind="oldpwAttr"
              id="current_password"
              placeholder="សូមបញ្ចូលលេខសម្ងាត់ចាស់..."
            />
            <small class="text-red-500">{{ errors.current_password }}</small>
          </div>
          <div class="grid gap-2">
            <Label for="new_password">លេខសម្ងាត់ថ្មី</Label>
            <PasswordInput
              v-model:password="newpw"
              v-bind="newpwAttr"
              id="new_password"
              placeholder="សូមបញ្ចូលលេខសម្ងាត់ថ្មី..."
            />
            <small class="text-red-500">{{ errors.new_password }}</small>
          </div>
          <div class="grid gap-2">
            <Label for="new_password_confirmation">បញ្ជាក់លេខសម្ងាត់ថ្មី</Label>
            <PasswordInput
              v-model:password="connewpw"
              v-bind="connewpwAttr"
              id="new_password_confirmation"
              placeholder="សូមបញ្ចូលលេខសម្ងាត់ថ្មីម្ដងទៀត..."
            />
            <small class="text-red-500">{{
              errors.new_password_confirmation
            }}</small>
          </div>
          <Button
            v-if="!isSubmitting"
            :disabled="!meta.valid"
            type="submit"
            class="w-full"
            >ផ្លាស់ប្ដូរលេខសម្ងាត់</Button
          >
          <Button v-else disabled class="w-full">
            <Icon name="svg-spinners:180-ring-with-bg" class="h-4 w-4" />
            កំពុងផ្លាស់ប្ដូរ
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
