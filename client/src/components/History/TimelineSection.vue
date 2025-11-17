<template>
  <div class="bg-[#0f172a] py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-white text-center mb-12">Linimasa Sejarah</h2>
      <div class="relative">
        <!-- Timeline Line -->
        <div class="absolute left-1/2 h-full w-0.5 bg-gray-600 transform -translate-x-1/2"></div>

        <!-- Timeline Items -->
        <div v-for="(item, index) in timelineItems" :key="index" class="mb-8 flex justify-between items-center w-full" :class="index % 2 === 0 ? 'flex-row-reverse' : ''">
          <div class="w-5/12"></div>
          <div class="z-20 flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full">
            <div class="w-4 h-4 bg-[#0f172a] rounded-full"></div>
          </div>
          <div class="w-5/12 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold text-yellow-500">{{ item.year }}</h3>
            <p class="text-gray-300 mt-2">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimelineSection',
  data() {
    return {
      timelineItems: [
        {
          year: '1267',
          description: 'Kerajaan Samudera Pasai didirikan oleh Marah Silu, yang kemudian bergelar Sultan Malik as-Saleh.'
        },
        {
          year: '1292',
          description: 'Marco Polo, dalam perjalanannya, singgah di Kerajaan Samudera Pasai dan mencatatnya sebagai kerajaan Islam yang makmur.'
        },
        {
          year: '1345',
          description: 'Ibnu Battutah, penjelajah dari Maroko, mengunjungi Pasai dan mencatat kebesaran Sultan serta ketaatan rakyatnya pada ajaran Islam.'
        },
        {
          year: '1405',
          description: 'Armada Laksamana Cheng Ho dari Tiongkok mengunjungi Pasai, menunjukkan hubungan diplomatik dan perdagangan yang kuat.'
        },
        {
          year: '1521',
          description: 'Kerajaan Samudera Pasai ditaklukkan oleh Portugis, yang menandai awal kemunduran kerajaan ini.'
        },
        {
          year: '1524',
          description: 'Samudera Pasai akhirnya jatuh di bawah kekuasaan Kesultanan Aceh Darussalam, mengakhiri riwayatnya sebagai kerajaan merdeka.'
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>
