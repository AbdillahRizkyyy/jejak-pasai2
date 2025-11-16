<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'
import { Moon, Sun } from 'lucide-vue-next'

const { isDark, toggleDark } = useDarkMode()
</script>

<template>
  <button
    @click="toggleDark()"
    class="btn btn-ghost btn-circle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Sun v-if="isDark" :size="20" />
    <Moon v-else :size="20" />
  </button>
</template>
