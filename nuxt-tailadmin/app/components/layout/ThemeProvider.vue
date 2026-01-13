<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>('system')

const updateDOM = (mode: 'light' | 'dark') => {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = () => {
  if (theme.value === 'system') {
    updateDOM(getSystemTheme())
  } else {
    updateDOM(theme.value)
  }
}

const setTheme = (newTheme: Theme) => {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  applyTheme()
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  if (savedTheme) theme.value = savedTheme
  
  applyTheme()

  // Listen for System OS changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'system') applyTheme()
  })
})

provide('theme', {
  theme,
  setTheme,
})
</script>

<script lang="ts">
import { inject } from 'vue'
export function useTheme() {
  const context = inject<{ theme: any, setTheme: (t: 'light' | 'dark' | 'system') => void }>('theme')
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
</script>