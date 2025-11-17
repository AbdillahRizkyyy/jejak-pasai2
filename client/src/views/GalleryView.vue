<template>
  <div>
    <Header />
    <GallerySection />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import GallerySection from '@/components/Gallery/GallerySection.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'GalleryView',
  components: {
    Header,
    GallerySection,
    Footer
  }
};
</script>
