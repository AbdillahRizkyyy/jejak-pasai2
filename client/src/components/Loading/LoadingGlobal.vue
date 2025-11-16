<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <span class="loading loading-infinity loading-xl text-primary scale-150">
      <svg
        class="animate-spin h-5 w-5 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0 0 20 0zm0-2a10 10 0 1 1 20 0z"
        />
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/useLoading'
import { storeToRefs } from 'pinia'

const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)
</script>

<style scoped>
.loading {
  position: relative;
}

.loading::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: currentColor;
  border-radius: 50%;
  animation: loading-rotate 1.5s linear infinite;
}

.loading::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: currentColor;
  border-radius: 50%;
  animation: loading-rotate 1.5s linear infinite;
  animation-delay: 0.75s;
}

@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
