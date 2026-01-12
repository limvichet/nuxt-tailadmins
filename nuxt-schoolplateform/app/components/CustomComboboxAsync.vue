<script setup lang="ts">
import { Check, ChevronsUpDown, Search } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import type { HTMLAttributes } from "vue";
import { useElementSize, refDebounced } from "@vueuse/core";
import type { InternalApi } from "nitropack";
import { ref, watch, onMounted } from "vue";

/* --- Props & types --- */
interface LocationOption {
  id: number | string;
  value: string;
}

interface Props {
  endpoint: keyof InternalApi;
  optionsKey: string;
  id?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  buttonClass?: HTMLAttributes["class"];
  listClass?: HTMLAttributes["class"];
  queryName?: string;
  minChars?: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: "location-combobox",
  placeholder: "ជ្រើសរើសក្រសួង/ខេត្ត...",
  searchPlaceholder: "ស្វែងរកក្រសួង/ខេត្ត...",
  emptyText: "មិនមានទិន្នន័យត្រូវគ្នា.",
  buttonClass: "w-xs",
  queryName: "q",
  minChars: 3,
});

/* --- Local state --- */
const initialStates = ref<LocationOption[] | undefined>([]);
const selectedValue = defineModel<LocationOption | undefined>();

const buttonTrigger = useTemplateRef<HTMLButtonElement>("buttonTrigger");
const { width: buttonWidth } = useElementSize(
  buttonTrigger,
  { width: 0, height: 0 },
  { box: "border-box" }
);

onMounted(() => {
  if (selectedValue.value) {
    initialStates.value = [selectedValue.value];
  }
});

const inputValue = ref<string>("");
const debouncedInput = refDebounced(inputValue, 500); //debounced ref

const comboboxGrouopKey = ref<number>(0);
const isSearching = ref(false);

const instance = getCurrentInstance();
const instanceUid = instance?.uid ?? Math.random().toString(36).slice(2);
const { data, refresh, pending, clear } = useAsyncData(
  () => `options-${props.endpoint}-${instanceUid}`,
  async () => {
    // Make sure to encode query params
    const headers = useRequestHeaders(["cookie"]);
    const q = encodeURIComponent(inputValue.value);
    const res = await $fetch(`${props.endpoint}?${props.queryName}=${q}`, {
      headers,
    });
    return res;
  },
  { immediate: false }
);

watch(
  inputValue,
  (newVal) => {
    if (newVal && newVal.length >= props.minChars) {
      isSearching.value = true; // show spinner immediately (covers debounce)
      initialStates.value = undefined;
      clear();
    } else {
      isSearching.value = false;
      clear();
    }
  },
  { immediate: false }
);

watch(
  debouncedInput,
  async (val) => {
    if (val && val.length >= props.minChars) {
      try {
        await refresh();
      } finally {
        // network + debounce complete
        isSearching.value = false;
      }
    } else {
      isSearching.value = false;
    }
  },
  { immediate: false }
);
</script>

<template>
  <Combobox v-model="selectedValue" by="id">
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <Button
          :id="id"
          ref="buttonTrigger"
          type="button"
          variant="outline"
          :class="cn('justify-between text-muted-foreground', buttonClass)"
          aria-required="true"
        >
          {{ selectedValue?.value ?? placeholder }}
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList
      :key="comboboxGrouopKey"
      :trigger-width="buttonWidth"
      :class="cn('max-h-60', listClass)"
    >
      <div class="relative w-full items-center">
        <ComboboxInput
          v-model="inputValue"
          class="focus-visible:ring-0 rounded-none h-10"
          :placeholder="searchPlaceholder"
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
        >
          <Search class="size-4 text-muted-foreground" />
        </span>
      </div>

      <!-- Show spinner during debounce OR while request is in-flight -->
      <ComboboxEmpty v-if="pending || isSearching">
        <div class="flex items-center justify-center gap-2">
          <Icon
            name="svg-spinners:180-ring-with-bg"
            class="h-4 w-4 animate-spin"
          />
          កំពុងស្វែងរក
        </div>
      </ComboboxEmpty>

      <ComboboxEmpty v-else>
        {{ emptyText }}
      </ComboboxEmpty>

      <ComboboxGroup
        :key="comboboxGrouopKey"
        class="overflow-y-auto scroll-width-thin"
      >
        <template v-if="initialStates && initialStates.length > 0">
          <ComboboxItem
            v-for="option in initialStates"
            :key="option.id"
            :value="option"
          >
            {{ option.value }}
            <ComboboxItemIndicator>
              <Check :class="cn('ml-auto h-4 w-4')" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </template>

        <template v-else>
          <ComboboxItem
            v-for="option in data?.[props.optionsKey] || []"
            :key="option.id"
            :value="option"
          >
            {{ option.value }}
            <ComboboxItemIndicator>
              <Check :class="cn('ml-auto h-4 w-4')" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </template>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
