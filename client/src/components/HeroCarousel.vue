<template>
  <div class="relative w-full h-[calc(100vh-100px)] flex items-center justify-center">
    <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${slides[currentIndex].bg})` }"></div>
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <div class="relative bg-[#FFC700] p-12 rounded-3xl max-w-4xl w-full mx-auto flex items-center shadow-lg">
      <div class="w-1/2">
        <h1 class="text-4xl font-bold text-[#0A3D36] mb-4">{{ slides[currentIndex].title }}</h1>
        <p class="text-[#0A3D36] mb-6">{{ slides[currentIndex].text }}</p>
        <router-link to="/sejarah" class="text-[#0A3D36] font-semibold border-b-2 border-[#0A3D36] pb-1">
          BACA SELENGKAPNYA
        </router-link>
      </div>
      <div class="w-1/2 flex justify-center">
        <img :src="slides[currentIndex].image" alt="Slide Image" class="max-h-80">
      </div>
    </div>

    <button @click="prevSlide" class="absolute left-10 text-white text-4xl">
      &#x276E;
    </button>
    <button @click="nextSlide" class="absolute right-10 text-white text-4xl">
      &#x276F;
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import hero1 from '@/assets/images/hero-1.png'
import hero2 from '@/assets/images/hero-2.png'
import hero3 from '@/assets/images/hero-3.png'

const slides = ref([
  {
    bg: hero1,
    image: hero2,
    title: 'Sejarah Kerajaan Samudera Pasai',
    text: 'Pendiri Kerajaan Samudera Pasai adalah Meurah Silu, yang bergelar Sultan Malik as-Saleh. Bukti sejarahnya ada dari nisan makam dan catatan penjelajah seperti Marcopolo dan Ibnu Batutah.'
  },
  {
    bg: hero2,
    image: hero3,
    title: 'Lokasi Kerajaan Samudera Pasai',
    text: 'Kerajaan ini terletak di pesisir utara Sumatera, dekat Lhokseumawe, Aceh. Lokasinya yang strategis menjadikannya pusat perdagangan penting di Selat Malaka.'
  }
])

const currentIndex = ref(0)

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
}
</script>
