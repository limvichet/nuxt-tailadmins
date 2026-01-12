<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - District Resource`,
  description: "You can manage all district resources here!",
});
</script>

<template>
  <div class="space-y-4">
    <CustomPageTitle>
      <Icon name="lucide:map-pin" />
      គ្រប់គ្រងទិន្នន័យអំពី ស្រុក/ក្រុង/ខណ្ឌ
    </CustomPageTitle>
  </div>
</template>
