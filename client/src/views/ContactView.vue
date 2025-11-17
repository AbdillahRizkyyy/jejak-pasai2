<template>
  <div>
    <Header />
    <ContactForm />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import ContactForm from '@/components/Contact/ContactForm.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'ContactView',
  components: {
    Header,
    ContactForm,
    Footer
  }
};
</script>
