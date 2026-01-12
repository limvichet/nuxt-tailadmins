<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";
useSeoMeta({
  charset: "utf-8",
  title: defaultSeo.title,
  description: defaultSeo.desc,
  ogType: "website",
  ogSiteName: defaultSeo.site,
  ogTitle: defaultSeo.title,
  ogDescription: defaultSeo.desc,
  twitterTitle: defaultSeo.title,
  twitterSite: defaultSeo.site,
  twitterDescription: defaultSeo.desc,
});

// Get access to the shared state and handlers
const { state, onCancel, onConfirm } = useAlertDialog();
</script>

<template>
  <div>
    <Toaster class="font-sans" position="top-right" :duration="3000" />
    <NuxtLoadingIndicator
      :throttle="100"
      color="oklch(0.6508 0.2129 29.3611)"
    />
    <NuxtLayout>
      <NuxtPage />

      <LazyCustomAlert
        v-model:open="state.open"
        :title="state.title"
        :description="state.description"
        :cancel-text="state.cancelText"
        :confirm-text="state.confirmText"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </NuxtLayout>
  </div>
</template>
