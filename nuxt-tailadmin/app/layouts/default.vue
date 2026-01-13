<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Loader from '~/components/Common/Loader.vue'

const loading = ref(false)
const nuxtApp = useNuxtApp()

// ចាប់ផ្ដើមបង្ហាញ Loading ពេលប្ដូរទំព័រ
nuxtApp.hook('page:start', () => {
  loading.value = true
})

// បិទ Loading វិញពេលទំព័រដើរចប់
nuxtApp.hook('page:finish', () => {
  // ប្រើ setTimeout ដើម្បីឱ្យភ្នែកមើលទាន់ (ព្រោះ Localhost លឿនខ្លាំង)
  setTimeout(() => {
    loading.value = false
  }, 500)
})

// បិទ Loading ពេល App ចាប់ផ្ដើមដំបូងបង្អស់
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <div>
    <Loader v-if="loading" />
    <div v-show="!loading">
      <LayoutThemeProvider>
        <LayoutSidebarProvider>
          <slot />
        </LayoutSidebarProvider>
      </LayoutThemeProvider>
    </div>
  </div>

</template>
