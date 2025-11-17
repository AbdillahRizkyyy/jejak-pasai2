<script setup lang="ts">
import Header from '@/components/Header.vue';
import HeroCarousel from '@/components/HeroCarousel.vue';
import ExploreHistory from '@/components/ExploreHistory.vue';
import ThreeCardSection from '@/components/ThreeCardSection.vue';
import AboutUs from '@/components/AboutUs.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <Header />
  <main>
    <HeroCarousel />
    <ExploreHistory />
    <ThreeCardSection />
    <AboutUs />
  </main>
  <Footer />
</template>
