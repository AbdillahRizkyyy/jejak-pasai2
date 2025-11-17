<template>
  <div class="bg-gray-900 py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-white text-center mb-12">Peta Lokasi Bersejarah</h2>
      <div v-if="loading" class="text-center text-white">Loading map...</div>
      <div v-if="error" class="text-center text-red-500">{{ error }}</div>
      <div id="map" class="h-96 rounded-lg shadow-lg" v-show="!loading && !error"></div>
    </div>
  </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { destinasiService } from '@/services/destinasi.service';

const loading = ref(true);
const error = ref(null);
let map = null;

const initMap = (locations) => {
  if (map) {
    map.remove();
  }

  // Set default view to the first location or a default coordinate
  const initialView = locations.length > 0
    ? locations[0].koordinat.split(',').map(Number)
    : [5.1833, 97.15];

  map = L.map('map').setView(initialView, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  locations.forEach(location => {
    const [lat, lng] = location.koordinat.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>${location.nama_destinasi}</b><br>${location.alamat}`);
    }
  });
};

const fetchLocationsAndInitMap = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await destinasiService.getAllDestinasi();
    initMap(response.data.data);
  } catch (err) {
    console.error('Failed to fetch locations for map:', err);
    error.value = 'Gagal memuat peta. Silakan coba lagi nanti.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLocationsAndInitMap();
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});

</script>

<style scoped>
#map {
  z-index: 1;
}
</style>
