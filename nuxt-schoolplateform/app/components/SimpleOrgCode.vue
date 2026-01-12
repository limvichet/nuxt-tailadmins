<template>
  <div
    class="px-3 py-2 border bg-background shadow-xs dark:bg-input/30 dark:border-input rounded-md sm:rounded-sm md:rounded-md text-sm disabled:bg-muted"
    aria-disabled
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
