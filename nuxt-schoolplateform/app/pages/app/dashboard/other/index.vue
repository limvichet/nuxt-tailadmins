<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - Address`,
  description:
    "You can manage all provinces, districts, communes, villages here!",
});

const { allRoutes } = useRoutesInDir();
</script>

<template>
  <div class="space-y-4">
    <ul>
      <li v-for="route in allRoutes" :key="route">
        <NuxtLink :to="route">{{ route }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
