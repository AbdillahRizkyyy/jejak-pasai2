<template>
  <div class="bg-gray-900 py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-white text-center mb-12">Hubungi Kami</h2>
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Form -->
        <div class="bg-gray-800 p-8 rounded-lg shadow-lg">
          <form>
            <div class="mb-4">
              <label for="name" class="block text-yellow-500 font-bold mb-2">Nama</label>
              <input type="text" id="name" class="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
            </div>
            <div class="mb-4">
              <label for="email" class="block text-yellow-500 font-bold mb-2">E-mail</label>
              <input type="email" id="email" class="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
            </div>
            <div class="mb-4">
              <label for="message" class="block text-yellow-500 font-bold mb-2">Pesan</label>
              <textarea id="message" rows="5" class="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"></textarea>
            </div>
            <button type="submit" class="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300">Kirim Pesan</button>
          </form>
        </div>
        <!-- Contact Info -->
        <div class="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h3 class="text-2xl font-bold text-white mb-4">Informasi Kontak</h3>
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 text-yellow-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span class="text-gray-300">jejakpasai@gmail.com</span>
          </div>
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 text-yellow-500 mr-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            <span class="text-gray-300">jejakpasai@gmail.com</span>
          </div>
          <div class="flex items-center">
            <svg class="w-6 h-6 text-yellow-500 mr-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>
            <span class="text-gray-300">jejakpasai@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactForm'
};
</script>
