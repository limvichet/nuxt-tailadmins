<script setup lang="ts">
import { registerFormFull } from "~/schemas/auth";

definePageMeta({
  layout: "default-to-auth",
  guestOnly: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - Register`,
  description:
    "This is your register/signup page where you can create an account to start using our platform!",
});

const { register, loading } = useAuth();
const { fields, meta, handleSubmit, errors } = useCustomFields({
  validationSchema: registerFormFull,
});

const err = ref<string[] | null>(null);
const submitForm = handleSubmit(async (data) => {
  err.value = null;
  try {
    await register(data);
    await navigateTo("/app/dashboard");
  } catch (error: any) {
    // create array of error
    if (!error.data.data) err.value = [error.data.statusMessage! as string];
    else err.value = Object.values(error.data.data).flat() as string[];
  }
});
</script>

<template>
  <div class="w-full h-screen flex flex-col items-center justify-center gap-4">
    <PublicFullLogo class="aspect-[5.08/1.76] h-6 lg:h-8 w-fit" />
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl text-center font-black"
          >បង្កើតគណនីថ្មី!</CardTitle
        >
        <CardDescription class="text-center text-sm">
          សូមបញ្ចូលព័ត៌មានរបស់អ្នក ដើម្បីបង្កើតគណនីថ្មី
        </CardDescription>
        <ShowAuthError :err="err" />
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submitForm" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="name">ឈ្មោះគណនី</Label>
            <Input
              v-model:model-value="fields.name.model.value"
              v-bind="fields.name.props"
              id="name"
              placeholder="ឧ. Sok Sovann"
              required
            />
            <small class="text-red-500">{{ errors.name }}</small>
          </div>
          <div class="grid gap-2">
            <Label for="email">អ៊ីមែល</Label>
            <Input
              v-model:model-value="fields.email.model.value"
              v-bind="fields.email.props"
              id="email"
              type="email"
              placeholder="ឧ. soksovann@gmail.com"
              required
            />
            <small class="text-red-500">{{ errors.email }}</small>
          </div>
          <div class="grid gap-2">
            <Label for="password">លេខសម្ងាត់</Label>
            <PasswordInput
              v-model:password="fields.password.model.value"
              v-bind="fields.password.props"
              id="password"
              placeholder="សូមបញ្ចូលលេខសម្ងាត់..."
              required
            />
            <small class="text-red-500">{{ errors.password }}</small>
          </div>
          <div class="grid gap-2">
            <Label for="password_confirmation">លេខសម្ងាត់បញ្ជាក់</Label>
            <PasswordInput
              v-model:password="fields.password_confirmation.model.value"
              v-bind="fields.password_confirmation.props"
              id="password_confirmation"
              placeholder="សូមបញ្ចូលលេខសម្ងាត់ម្ដងទៀត..."
              required
            />
            <small class="text-red-500">{{
              errors.password_confirmation
            }}</small>
          </div>
          <Button
            :disabled="!meta.valid"
            v-if="!loading"
            type="submit"
            class="w-full"
            >បង្កើតគណនីថ្មី!</Button
          >
          <Button v-else class="w-full" disabled type="submit"
            ><Icon class="text-lg" name="svg-spinners:180-ring-with-bg"
          /></Button>
        </form>
        <div class="mt-4 text-center text-sm">
          មានគណនីរួចហើយ?
          <NuxtLink to="/login" class="hover:underline hover:decoration-primary"
            >ចូលប្រើប្រាស់គណនី (Login)</NuxtLink
          >
        </div>
      </CardContent>
    </Card>
  </div>
</template>
