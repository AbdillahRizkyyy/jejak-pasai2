<template>
  <div class="bg-[#0f172a] py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-white text-center mb-12">Galeri</h2>
      <div v-if="loading" class="text-center text-white">Loading...</div>
      <div v-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-if="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="item in gallery" :key="item.id" class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <img :src="getImageUrl(item.file)" :alt="item.judul" class="w-full h-48 object-cover cursor-pointer" @click="openModal(item)">
          <div class="p-4">
            <h3 class="text-lg font-bold text-yellow-500">{{ item.judul }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closeModal">
    <div class="max-w-3xl max-h-full p-4" @click.stop>
      <img :src="getImageUrl(selectedImage.file)" :alt="selectedImage.judul" class="max-w-full max-h-[80vh] object-contain">
      <h3 class="text-white text-center text-xl mt-4">{{ selectedImage.judul }}</h3>
      <button @click="closeModal" class="absolute top-4 right-4 text-white text-3xl">&times;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { galeriService } from '@/services/galeri.service';
import { API_BASE_URL } from '@/config/config';

const gallery = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedImage = ref(null);

const fetchGallery = async () => {
  try {
    const response = await galeriService.getAllGaleri();
    gallery.value = response.data.data;
  } catch (err) {
    console.error('Failed to fetch gallery:', err);
    error.value = 'Gagal memuat galeri. Silakan coba lagi nanti.';
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (imagePath) => {
  return `${API_BASE_URL}/public/${imagePath}`;
};

const openModal = (item) => {
  selectedImage.value = item;
};

const closeModal = () => {
  selectedImage.value = null;
};

onMounted(() => {
  fetchGallery();
});
</script>

<style scoped>
</style>
