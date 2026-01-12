<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - Staff`,
  description:
    "You can create, search, update information such as persmissions and more for staffs in this page!",
});
</script>

<template>
  <div class="space-y-4">
    <CustomPageTitle>
      <Icon name="lucide:user-round" />
      ព័ត៌មានបុគ្គលិក
    </CustomPageTitle>
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-4 *:border *:p-4 *:rounded-sm *:md:rounded-md *:lg:rounded-lg *:transition-colors *:hover:border-primary/50 *:font-semibold"
    >
      <NuxtLink to="/app/dashboard/staff/search"
        >Search - ស្វែងរកព័ត៌មានបុគ្គលិក</NuxtLink
      >
      <NuxtLink to="/app/dashboard/staff/create"
        >Create - បង្កើតព័ត៌មានបុគ្គលិកថ្មី</NuxtLink
      >
    </div>
  </div>
</template>
