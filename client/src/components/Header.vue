<template>
  <header class="bg-[#0A3D36] text-white p-6 flex justify-between items-center">
    <div class="flex items-center">
      <img src="@/assets/images/logo.png" alt="Jejak Pasai Logo" class="h-10 mr-4">
      <span class="text-xl font-semibold">JEJAK PASAI</span>
    </div>
    <nav>
      <ul class="flex space-x-8">
        <li><router-link to="/" class="hover:text-yellow-400">BERANDA</router-link></li>
        <li><router-link to="/sejarah" class="hover:text-yellow-400">SEJARAH</router-link></li>
        <li><router-link to="/lokasi" class="hover:text-yellow-400">LOKASI</router-link></li>
        <li><router-link to="/galeri" class="hover:text-yellow-400">GALERI</router-link></li>
        <li><router-link to="/kontak" class="hover:text-yellow-400">KONTAK</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
</style>
