<script setup lang="ts">
import FooterCard from '@/components/Card/FooterCard.vue'
import NavbarCard from '@/components/Card/NavbarCard.vue'
</script>

<template>
  <NavbarCard />

  <main class="min-h-screen bg-base-200 flex flex-col">
    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center text-center py-20 px-4">
      <h1 class="text-4xl md:text-5xl font-extrabold mb-4 text-primary">
        Selamat Datang di <span class="text-secondary">Halaman Home</span>
      </h1>
      <p class="max-w-2xl text-base md:text-lg text-base-content/70 mb-8">
        Kami hadir untuk membantu Anda menemukan solusi terbaik di bidang teknologi, pengembangan
        aplikasi, dan pemecahan masalah IT.
      </p>
      <div class="flex gap-4">
        <a href="#layanan" class="btn btn-primary btn-wide">Lihat Layanan</a>
        <a href="#kontak" class="btn btn-outline btn-secondary btn-wide">Hubungi Kami</a>
      </div>
    </section>

    <!-- Card Section -->
    <section id="layanan" class="flex-1 px-6 md:px-12 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div class="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div class="card-body">
            <h2 class="card-title text-primary">💡 Menghitung</h2>
            <p class="text-base-content/80">
              Kami berkomitmen membantu Anda dalam menyelesaikan persoalan IT secara efisien dengan
              pendekatan logis dan berbasis data.
            </p>
            <div class="card-actions justify-end mt-4">
              <button class="btn btn-sm btn-primary">Pelajari</button>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div class="card-body">
            <h2 class="card-title text-primary">🚀 Kelebihan</h2>
            <ul class="list-disc list-inside text-base-content/80 space-y-1">
              <li>Membantu debugging dan pemecahan error</li>
              <li>Mendukung pengembangan aplikasi dari awal</li>
              <li>Memberikan insight terbaik untuk efisiensi proyek</li>
            </ul>
            <div class="card-actions justify-end mt-4">
              <button class="btn btn-sm btn-primary">Selengkapnya</button>
            </div>
          </div>
        </div>

        <div
          id="kontak"
          class="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <div class="card-body">
            <h2 class="card-title text-primary">📞 Kontak</h2>
            <p class="text-base-content/80">
              Jika Anda membutuhkan bantuan atau ingin berdiskusi langsung dengan kami, jangan ragu
              untuk menghubungi lewat kontak berikut:
            </p>
            <div class="mt-4">
              <a href="mailto:example@example.com" class="link link-primary text-lg font-medium">
                example@example.com
              </a>
            </div>
            <div class="card-actions justify-end mt-4">
              <button class="btn btn-sm btn-secondary">Kirim Pesan</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary text-primary-content py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">Siap Bekerja Sama?</h2>
      <p class="max-w-xl mx-auto text-base mb-6">
        Mari wujudkan ide-ide kreatif Anda menjadi kenyataan. Kami siap mendukung setiap langkah
        pengembangan dan inovasi Anda.
      </p>
      <a href="#kontak" class="btn btn-secondary btn-wide">Hubungi Sekarang</a>
    </section>
  </main>

  <FooterCard />
</template>
