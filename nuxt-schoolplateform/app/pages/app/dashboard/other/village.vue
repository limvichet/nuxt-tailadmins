<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - Village Resource`,
  description: "You can manage all village resources here!",
});
</script>

<template>
  <div class="space-y-4">
    <CustomPageTitle>
      <Icon name="lucide:map-pin" />
      គ្រប់គ្រងទិន្នន័យអំពី ភូមិ
    </CustomPageTitle>
  </div>
</template>
