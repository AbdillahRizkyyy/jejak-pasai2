<script setup lang="ts">
import ButtonDarkmode from '@/components/Button/ButtonDarkmode.vue'
import { useUserStore } from '@/stores/user'
import { LayoutDashboardIcon, LogInIcon } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()
</script>

<template>
  <div class="card w-full bg-base-100 shadow-xl">
    <div class="card-body">
      <nav class="flex justify-between">
        <div class="flex items-center">
          <router-link to="/" class="btn btn-ghost text-primary">
            <span class="material-symbols-outlined">Home</span>
          </router-link>
          <router-link to="/about" class="btn btn-ghost text-primary ml-2">
            <span class="material-symbols-outlined">About Us</span>
          </router-link>
        </div>
        <div class="flex items-center">
          <router-link
            to="/login"
            v-if="!userStore.isAuthenticated"
            class="btn btn-ghost text-primary"
          >
            <span class="material-symbols-outlined"> <log-in-icon /> Login </span>
          </router-link>
          <router-link
            to="/dashboard"
            v-if="userStore.isAuthenticated"
            class="btn btn-ghost text-primary"
          >
            <span class="material-symbols-outlined">
              <layout-dashboard-icon />
            </span>
          </router-link>
          <button-darkmode />
        </div>
      </nav>
    </div>
  </div>
</template>

<style scoped>
nav {
  @apply flex items-center justify-between;
}

nav .btn:not(:first-child) {
  @apply ml-2;
}
</style>
