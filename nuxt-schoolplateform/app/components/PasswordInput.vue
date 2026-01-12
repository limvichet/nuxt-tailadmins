<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const pw = defineModel<string>("password");
const inputType = ref<"text" | "password">("password");
const togglePasswordVisibility = () => {
  inputType.value = inputType.value === "password" ? "text" : "password";
};

const props = defineProps<{
  id?: string;
  placeholder?: string;
  class?: HTMLAttributes["class"];
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  autofocus?: boolean;
  name?: string;
}>();
</script>

<template>
  <div class="w-full h-fit relative">
    <Input v-model="pw" :type="inputType" v-bind="props" />
    <Icon
      v-if="pw && pw.length > 0"
      @click="togglePasswordVisibility"
      class="cursor-pointer absolute top-1/2 -translate-y-1/2 right-3 scale-125 lg:scale-100"
      :name="
        inputType === 'password' ? 'mdi:eye-outline' : 'mdi:eye-off-outline'
      "
    />
  </div>
</template>
