<script setup lang="ts">
import ButtonDarkmode from '@/components/Button/ButtonDarkmode.vue'
import { useUserStore } from '@/stores/user'
import { LayoutDashboardIcon, LogInIcon } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300 shadow-sm"
  >
    <div class="navbar max-w-7xl mx-auto px-4 md:px-8">
      <!-- Left: Brand -->
      <div class="flex items-center gap-2">
        <router-link to="/" class="btn btn-ghost text-primary">
          <span class="material-symbols-outlined">Home</span>
        </router-link>
        <router-link to="/about" class="btn btn-ghost text-primary">
          <span class="material-symbols-outlined">About Us</span>
        </router-link>
      </div>

      <!-- Right: Auth & Theme -->
      <div class="ml-auto flex items-center gap-2">
        <RouterLink
          v-if="!userStore.isAuthenticated"
          to="/login"
          class="btn btn-sm btn-ghost text-base-content hover:text-primary"
        >
          <LogInIcon class="w-4 h-4 mr-1" />
          <span class="hidden sm:inline">Login</span>
        </RouterLink>

        <RouterLink
          v-else
          to="/dashboard"
          class="btn btn-sm btn-ghost text-base-content hover:text-primary"
        >
          <LayoutDashboardIcon class="w-4 h-4 mr-1" />
          <span class="hidden sm:inline">Dashboard</span>
        </RouterLink>

        <ButtonDarkmode />
      </div>
    </div>
  </header>
</template>
