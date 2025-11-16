<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center p-4">
    <div class="max-w-md mx-auto">
      <h1 class="text-9xl font-extrabold text-primary mb-4 animate-bounce">404</h1>
      <h2 class="text-4xl font-bold text-base-content mb-6">Halaman Tidak Ditemukan</h2>
      <p class="text-lg text-base-content mb-8">
        Kami mohon maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan periksa kembali URL,
        atau halaman mungkin telah dipindahkan atau dihapus.
      </p>
      <router-link to="/" class="btn btn-primary btn-lg"> Kembali ke Beranda </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Tidak ada logika khusus yang diperlukan di sini
</script>

<style scoped>
/* Animasi bounce untuk 404 */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
