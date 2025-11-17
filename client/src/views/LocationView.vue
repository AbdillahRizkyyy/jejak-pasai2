<template>
  <div>
    <Header />
    <MapSection />
    <LocationList />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import MapSection from '@/components/Location/MapSection.vue';
import LocationList from '@/components/Location/LocationList.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'LocationView',
  components: {
    Header,
    MapSection,
    LocationList,
    Footer
  }
};
</script>
