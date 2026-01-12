<script setup lang="ts">
import { loginFormFull } from "~/schemas/auth";

definePageMeta({
  layout: "default-to-auth",
  guestOnly: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - Login`,
  description:
    "This is your login page where you can enter your credentials to access your accounts information!",
});

const { login, loading } = useAuth();
const { fields, meta, handleSubmit, errors } = useCustomFields({
  validationSchema: loginFormFull,
});

const err = ref<string[] | null>(null);
const submitForm = handleSubmit(async (data) => {
  const redirectTo =
    useRoute().query.redirectTo?.toString() || "/app/dashboard";
  err.value = null;
  try {
    await login(data);
    await navigateTo(redirectTo);
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
          >ចូលប្រើប្រាស់គណនី!</CardTitle
        >
        <CardDescription class="text-center text-sm">
          សូមបញ្ចូលព័ត៌មានរបស់អ្នក ដើម្បីចូលប្រើប្រាស់គណនី
        </CardDescription>
        <ShowAuthError :err="err" />
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submitForm" class="grid gap-4">
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
            <div class="flex items-center">
              <Label for="password">លេខសម្ងាត់</Label>
              <!-- <NuxtLink to="#" class="ml-auto inline-block text-sm underline">
                ភ្លេចលេខសម្ងាត់?
              </NuxtLink> -->
            </div>
            <PasswordInput
              v-model:password="fields.password.model.value"
              v-bind="fields.password.props"
              id="password"
              placeholder="សូមបញ្ចូលលេខសម្ងាត់..."
              required
            />
            <small class="text-red-500">{{ errors.password }}</small>
          </div>
          <Button
            :disabled="!meta.valid"
            v-if="!loading"
            type="submit"
            class="w-full"
            >ចូលប្រើប្រាស់គណនី!</Button
          >
          <Button v-else class="w-full" disabled type="submit"
            ><Icon class="text-lg" name="svg-spinners:180-ring-with-bg"
          /></Button>
        </form>
        <div class="mt-4 text-center text-sm">
          មិនទាន់មានគណនី?
          <NuxtLink
            to="/register"
            class="hover:underline hover:decoration-primary"
          >
            បង្កើតគណនីថ្មី (Register)
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
