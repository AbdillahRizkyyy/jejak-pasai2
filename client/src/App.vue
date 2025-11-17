<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>

<template>
  <div class="bg-[#0A3D36] min-h-screen">
    <Header />
    <RouterView />
  </div>
</template>
