<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";

const SHOW_WHEN: number = 300;
const { y } = useWindowScroll({ behavior: "smooth" });

const enter_leave_active =
  "transition-[translate,opacity] duration-500 ease-[linear(0,0.003_0.4%,0.012_0.9%,0.027_1.4%,0.05_2%,0.111_3.3%,0.316_7.2%,0.411_9.2%,0.466_10.5%,0.517_11.8%,0.566_13.2%,0.611_14.6%,0.653_16.1%,0.694_17.7%,0.732_19.4%,0.765_21.1%,0.796_22.9%,0.824_24.8%,0.849_26.8%,0.872_28.9%,0.892_31.1%,0.91_33.4%,0.925_35.8%,0.939_38.4%,0.95_41.1%,0.961_44.1%,0.97_47.4%,0.977_50.9%,0.987_58.7%,0.994_68.4%,0.998_81.1%,1)]";
const enter_from_leave_to = "opacity-0 translate-y-1/2";
</script>

<template>
  <Transition
    :enter-active-class="enter_leave_active"
    :leave-active-class="enter_leave_active"
    :enter-from-class="enter_from_leave_to"
    :leave-to-class="enter_from_leave_to"
  >
    <button
      v-if="y >= SHOW_WHEN"
      @click="y = 0"
      class="fixed bottom-0 right-0 z-50 m-4 lg:m-6 bg-public-red text-white shadow-lg cursor-pointer transition-[scale] duration-75 active:scale-90 rounded-full grid place-items-center size-11"
    >
      <Icon class="size-6! lg:size-8!" name="lucide:chevron-up" />
    </button>
  </Transition>
</template>
