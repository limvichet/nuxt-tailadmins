<script setup lang="ts">
import FooterServer from "~/components/public/Footer.server.vue";
import ScrollTop from "~/components/public/ScrollTop.vue";
</script>

<template>
  <div class="bg-zinc-100">
    <LazyPublicHeader />
    <slot />
    <FooterServer />
    <ScrollTop />
  </div>
</template>
