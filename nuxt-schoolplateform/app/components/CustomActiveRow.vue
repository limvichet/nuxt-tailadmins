<script setup lang="ts">
const props = defineProps<{
  condition: boolean;
}>();
</script>

<template>
  <div class="grid items-center">
    <Icon
      v-if="props.condition"
      name="material-symbols:check-circle-outline-rounded"
      class="text-lg text-green-600 dark:text-green-500"
    />
    <Icon
      v-else
      name="material-symbols:cancel-outline-rounded"
      class="text-lg text-red-600 dark:text-red-500"
    />
  </div>
</template>
