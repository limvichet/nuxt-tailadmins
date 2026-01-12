<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - School`,
  description:
    "You can do some actions like searching, creating and more on one of those pages available in this section!",
});
</script>

<template>
  <div class="space-y-4">
    <CustomPageTitle>
      <Icon name="lucide:building" />
      ព័ត៌មានអង្គភាពថ្មី
    </CustomPageTitle>
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-4 *:border *:p-4 *:rounded-sm *:md:rounded-md *:lg:rounded-lg *:transition-colors *:hover:border-primary/50 *:font-semibold"
    >
      <NuxtLink to="/app/dashboard/location/search"
        >Search - ស្វែងរកព័ត៌មានអង្គភាព</NuxtLink
      >
      <NuxtLink to="/app/dashboard/location/create"
        >Create - បង្កើតព័ត៌មានអង្គភាពថ្មី</NuxtLink
      >
    </div>
  </div>
</template>
