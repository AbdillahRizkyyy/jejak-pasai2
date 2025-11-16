<script setup lang="ts">
import LoadingGlobal from '@/components/Loading/LoadingGlobal.vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useHead } from '@vueuse/head'
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'

const { isDark } = useDarkMode()

// Setup head
useHead({
  title: 'My App',
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  meta: [{ name: 'description', content: 'My awesome Vue app' }],
})
</script>

<template>
  <LoadingGlobal />
  <Toaster
    position="top-right"
    richColors
    :duration="3000"
    :theme="isDark ? 'dark' : 'light'"
    closeButtonPosition="top-right"
  />
  <RouterView />
</template>
