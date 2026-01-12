<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div data-slot="table-container" class="relative w-full overflow-auto scroll-width-thin">
    <table
      data-slot="table"
      :class="cn('w-full caption-bottom text-sm transition-[filter,opacity] duration-150', props.class)"
    >
      <slot />
    </table>
  </div>
</template>
