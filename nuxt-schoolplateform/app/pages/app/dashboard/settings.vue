<script setup lang="ts">
definePageMeta({
  layout: "auth",
  requiresAuth: true,
});

use1EZSeo({
  title: `${defaultSeo.title} - Settings`,
  description:
    "This is your settings page where you can manage color themes and more!",
});

const colorMode = useColorMode();
</script>

<template>
  <div class="flex flex-col gap-4 mt-1">
    <div class="flex items-center gap-4">
      <h3 class="leading-0">ពណ៍របស់កម្មវិធី:</h3>
      <Select v-model="colorMode.preference">
        <SelectTrigger class="w-[160px]">
          <SelectValue placeholder="Select Theme!" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="system">ផ្អែកតាមពណ៌ OS</SelectItem>
            <SelectItem value="light">ផ្ទៃពណ៌ស</SelectItem>
            <SelectItem value="dark">ផ្ទៃពណ៌ខ្មៅ</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
