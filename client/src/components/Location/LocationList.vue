<template>
  <div class="bg-[#0f172a] py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-white text-center mb-12">Daftar Lokasi</h2>
      <div v-if="loading" class="text-center text-white">Loading...</div>
      <div v-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="location in locations" :key="location.id" class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <img :src="getImageUrl(location.gambar)" :alt="location.nama_destinasi" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-bold text-yellow-500">{{ location.nama_destinasi }}</h3>
            <p class="text-gray-300 mt-2">{{ location.deskripsi }}</p>
            <div class="mt-4">
              <a :href="`https://maps.google.com/?q=${location.koordinat}`" target="_blank" class="text-yellow-500 hover:underline">Lihat di Peta</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { destinasiService } from '@/services/destinasi.service';
import { API_BASE_URL } from '@/config/config';

const locations = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchLocations = async () => {
  try {
    const response = await destinasiService.getAllDestinasi();
    locations.value = response.data.data;
  } catch (err) {
    console.error('Failed to fetch locations:', err);
    error.value = 'Gagal memuat data lokasi. Silakan coba lagi nanti.';
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (imagePath) => {
  // Assuming the backend serves static files from a 'public' folder mapped to the base URL
  // and the image path is stored relative to that folder (e.g., 'uploads/image.jpg')
  return `${API_BASE_URL}/public/${imagePath}`;
};


onMounted(() => {
  fetchLocations();
});
</script>

<style scoped>
</style>
