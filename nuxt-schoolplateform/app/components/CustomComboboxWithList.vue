<script setup lang="ts">
import { Check, ChevronsUpDown, Search } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import type { HTMLAttributes, Ref, Reactive } from "vue";
import { useElementSize } from "@vueuse/core";
import type { SelectOption } from "~/lib/schema";

// Define the component's props
interface Props {
  refetchBaseOn?: unknown;
  options: SelectOption[];
  id?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  buttonClass?: HTMLAttributes["class"];
  listClass?: HTMLAttributes["class"];
  badge?: string | undefined;
  disabled?: boolean;
  tabindex?: number;
}

// Set default values for optional props
const props = withDefaults(defineProps<Props>(), {
  id: "location-combobox",
  placeholder: "ជ្រើសរើសក្រសួង/ខេត្ត",
  searchPlaceholder: "ស្វែងរកក្រសួង/ខេត្ត...",
  emptyText: "មិនមានទិន្នន័យត្រូវគ្នា.",
  buttonClass: "w-xs",
  badge: undefined,
  disabled: false,
});

const emit = defineEmits<{
  (e: "refetch", value: unknown): void;
}>();

// created local state and model for selected value
const selectedValue = defineModel<SelectOption | undefined>();
const buttonTrigger = useTemplateRef<HTMLButtonElement>("buttonTrigger");
const { width: buttonWidth } = useElementSize(
  buttonTrigger,
  { width: 0, height: 0 },
  { box: "border-box" }
);

watch(
  () => props.refetchBaseOn,
  (newValue) => {
    if (newValue) {
      selectedValue.value = undefined;
      emit("refetch", newValue);
    }
  }
);

const computedEmptyText = computed(() => {
  if (props.refetchBaseOn === undefined || props.refetchBaseOn === null) {
    return "សូមជ្រើសរើសទិន្នន័យខាងដើមជាមុនសិន!";
  }
  return props.emptyText;
});
</script>

<template>
  <Combobox v-model="selectedValue" by="id" :disabled="props.disabled">
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <Button
          :id="id"
          :tabindex="props.tabindex"
          ref="buttonTrigger"
          type="button"
          variant="outline"
          :class="
            cn(
              `${
                selectedValue?.value
                  ? 'text-foreground'
                  : 'text-muted-foreground/50 dark:text-muted-foreground/70'
              } justify-between `,
              buttonClass
            )
          "
          aria-required="true"
        >
          {{ selectedValue?.value ?? placeholder }}
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList
      :trigger-width="buttonWidth"
      :class="cn('max-h-60', listClass)"
    >
      <div class="relative w-full items-center">
        <ComboboxInput
          class="focus-visible:ring-0 rounded-none h-10"
          :placeholder="searchPlaceholder"
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
        >
          <Search class="size-4 text-muted-foreground" />
        </span>
      </div>

      <ComboboxEmpty>{{
        !!props.badge ? props.badge : computedEmptyText
      }}</ComboboxEmpty>

      <ComboboxGroup class="overflow-y-auto scroll-width-thin">
        <ComboboxItem
          v-for="option in options"
          :key="option.id"
          :value="option"
        >
          {{ option.value }}
          <ComboboxItemIndicator>
            <Check :class="cn('ml-auto h-4 w-4')" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
