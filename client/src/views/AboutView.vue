<script setup lang="ts">
import FooterCard from '@/components/Card/FooterCard.vue'
import NavbarCard from '@/components/Card/NavbarCard.vue'
</script>

<template>
  <NavbarCard />

  <main class="bg-base-200 min-h-screen flex flex-col">
    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center text-center py-24 px-6">
      <h1 class="text-4xl md:text-5xl font-extrabold text-primary mb-4">Tentang Kami</h1>
      <p class="max-w-2xl text-base md:text-lg text-base-content/70">
        Kami adalah tim yang fokus pada pengembangan aplikasi web dan solusi digital berbasis
        teknologi. Tujuan kami adalah membantu individu maupun organisasi mencapai efisiensi dan
        inovasi melalui software yang kami bangun.
      </p>
    </section>

    <!-- Content Section -->
    <section class="flex-1 px-6 md:px-12 pb-20">
      <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-primary">Visi Kami</h2>
          <p class="text-base-content/80 leading-relaxed">
            Menciptakan ekosistem digital yang inklusif dan berkelanjutan dengan memberikan solusi
            berbasis teknologi yang mudah diakses, efisien, dan berdampak nyata.
          </p>

          <h2 class="text-2xl font-semibold text-primary mt-8">Misi Kami</h2>
          <ul class="list-disc list-inside text-base-content/80 space-y-2">
            <li>Mengembangkan aplikasi yang mudah digunakan dan efisien.</li>
            <li>Meningkatkan produktivitas pengguna melalui otomatisasi dan AI.</li>
            <li>Mendukung inovasi digital di berbagai sektor.</li>
          </ul>
        </div>

        <!-- Random ID Fun Section -->
        <div class="bg-base-100 shadow-xl rounded-2xl p-8 text-center">
          <h3 class="text-xl font-bold mb-3 text-secondary">Fun Fact</h3>
          <p class="text-base-content/70 mb-4">
            Setiap kali halaman ini dimuat, kode unik berikut dihasilkan:
          </p>
          <div class="font-mono text-lg bg-base-300 rounded-md p-2 inline-block select-all">
            {{ Math.random().toString(36).substring(2, 15) }}
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary text-primary-content text-center py-16">
      <h2 class="text-3xl font-bold mb-3">Ingin Bekerja Sama?</h2>
      <p class="max-w-xl mx-auto mb-6">
        Kami terbuka untuk kolaborasi, konsultasi, dan proyek pengembangan aplikasi digital. Mari
        wujudkan ide Anda bersama kami.
      </p>
      <RouterLink to="/contact" class="btn btn-secondary btn-wide">Hubungi Kami</RouterLink>
    </section>
  </main>

  <FooterCard />
</template>
