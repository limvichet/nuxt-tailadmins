<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - Commune Resource`,
  description: "You can manage all commune resources here!",
});
</script>

<template>
  <div class="space-y-4">
    <CustomPageTitle>
      <Icon name="lucide:map-pin" />
      គ្រប់គ្រងទិន្នន័យអំពី ឃុំ/សង្កាត់
    </CustomPageTitle>
  </div>
</template>
