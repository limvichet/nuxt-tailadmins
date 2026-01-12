<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
  type DateValue,
} from "@internationalized/date";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

interface CustomDateInputProps {
  id: string;
  class?: HTMLAttributes["class"];
  placeholder?: string;
  locale?: string;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
}

const props = withDefaults(defineProps<CustomDateInputProps>(), {
  class: "w-full",
  placeholder: "សូមជ្រើសរើសកាលបរិច្ឆេទ",
  locale: "en-US",
  maxValue: () => today(getLocalTimeZone()),
});

const modelValue = defineModel<string | undefined>();

const df = computed(
  () =>
    new DateFormatter(props.locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
);

const calendarDateValue = computed(() => {
  if (!modelValue.value) return undefined;
  try {
    return parseDate(modelValue.value);
  } catch (error) {
    console.warn(
      "Invalid date string provided to CustomDateInput:",
      modelValue.value
    );
    return undefined;
  }
});

const formattedDisplayValue = computed(() => {
  const date = calendarDateValue.value;
  if (date) {
    return df.value.format(date.toDate(getLocalTimeZone()));
  }
  return `${props.placeholder}...`;
});

function handleDateUpdate(value: DateValue | undefined): void {
  modelValue.value = value?.toString();
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        :id="props.id"
        variant="outline"
        :class="
          cn(
            `${props.class} px-3 justify-start text-left font-normal`,
            !calendarDateValue && 'text-muted-foreground'
          )
        "
      >
        {{ formattedDisplayValue }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        :model-value="calendarDateValue"
        :calendar-label="props.placeholder"
        initial-focus
        :min-value="props.minValue"
        :max-value="props.maxValue"
        @update:model-value="handleDateUpdate"
      />
    </PopoverContent>
  </Popover>
</template>
