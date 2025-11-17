<template>
  <div>
    <Header />
    <HeroSection />
    <TimelineSection />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import HeroSection from '@/components/History/HeroSection.vue';
import TimelineSection from '@/components/History/TimelineSection.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'HistoryView',
  components: {
    Header,
    HeroSection,
    TimelineSection,
    Footer
  }
};
</script>
