<template>
  <section class="py-16 px-4 bg-gray-50">
    <div class="container mx-auto">
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img src="@/assets/images/card1.png" alt="Makam Sultan Malik Al-Saleh" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2">Makam Sultan Malik Al-Saleh</h3>
            <p class="text-gray-600 mb-4">
              Jejak pendiri Kerajaan Samudera Pasai yang menjadi bukti otentik sejarah Islam di Nusantara.
            </p>
            <router-link to="/lokasi/1" class="text-yellow-500 font-semibold hover:underline">Lihat Detail</router-link>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img src="@/assets/images/card2.png" alt="Dirham Kerajaan" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2">Dirham Kerajaan</h3>
            <p class="text-gray-600 mb-4">
              Mata uang emas pertama di Nusantara yang menunjukkan kemajuan ekonomi pada masanya.
            </p>
            <router-link to="/galeri/1" class="text-yellow-500 font-semibold hover:underline">Lihat Detail</router-link>
          </div>
        </div>
        <!-- Card 3 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img src="@/assets/images/card3.png" alt="Peninggalan Lainnya" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2">Peninggalan Lainnya</h3>
            <p class="text-gray-600 mb-4">
              Jelajahi berbagai artefak dan peninggalan bersejarah lainnya dari Kerajaan Samudera Pasai.
            </p>
            <router-link to="/galeri" class="text-yellow-500 font-semibold hover:underline">Lihat Detail</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
