<script setup lang="ts">
import { type DateValue, DateFieldInput, DateFieldRoot } from "reka-ui";
import { CalendarDate, parseDate } from "@internationalized/date";
import type { HTMLAttributes } from "vue";
import { MAX_DATE, MIN_DATE } from "~/lib/schema";

interface CustomDateFieldProps {
  id: string;
  class?: HTMLAttributes["class"];
  locale?: string;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
}

const props = withDefaults(defineProps<CustomDateFieldProps>(), {
  locale: "en-GB",
  minValue: () => MIN_DATE,
  maxValue: () => MAX_DATE,
});

const modelValue = defineModel<string | undefined>();
const calculatedDateValue = computed(() => {
  if (!modelValue.value) return undefined;
  try {
    return parseDate(modelValue.value);
  } catch (error) {
    console.warn(
      "Invalid date string provided to CustomDateField:",
      modelValue.value
    );
    return undefined;
  }
});
const handleDateUpdate = (value: DateValue | undefined): void => {
  modelValue.value = value?.toString();
};
</script>

<template>
  <DateFieldRoot
    :id="props.id"
    :model-value="calculatedDateValue"
    @update:model-value="handleDateUpdate"
    :locale="props.locale"
    :min-value="props.minValue"
    :max-value="props.maxValue"
    v-slot="{ segments }"
    class="datefield-highlight-selected dark:bg-input/30 dark:border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
  >
    <template v-for="item in segments" :key="item.part">
      <DateFieldInput
        v-if="item.part === 'literal'"
        :part="item.part"
        inputmode="numeric"
      >
        {{ item.value }}
      </DateFieldInput>
      <DateFieldInput
        v-else
        :part="item.part"
        class="rounded px-0.5 py-0.5 focus:outline-2 focus:outline-primary"
      >
        {{ item.value }}
      </DateFieldInput>
    </template>
  </DateFieldRoot>
</template>
