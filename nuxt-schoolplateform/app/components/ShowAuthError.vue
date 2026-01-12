<script setup lang="ts">
defineProps<{
  err: string[] | null;
}>();
</script>

<template>
  <CardDescription
    v-if="err && err.length > 1"
    class="text-sm text-red-500 overflow-auto max-h-20 scroll-width-thin"
  >
    <ul class="text-left list-disc list-inside">
      <li v-for="e in err" :key="e">{{ e }}</li>
    </ul>
  </CardDescription>
  <CardDescription
    v-else-if="err && err.length === 1"
    class="text-sm text-red-500 text-center"
  >
    {{ err[0] }}
  </CardDescription>
</template>
