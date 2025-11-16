# 🚀 Starter Pack Web Development

Hai! 👋
Ini adalah salah satu **monorepo** yang dirancang untuk kamu yang ingin belajar atau mulai terjun ke dunia **web development** secara langsung — lengkap dengan **frontend** dan **backend** dalam satu tempat.

---

## 🧩 Description

Starter Pack Web Dev ini menggunakan konsep **monorepo**, di mana seluruh komponen yang berhubungan dengan pengembangan web (baik frontend maupun backend) dikelola dalam satu repositori terintegrasi.
Struktur project ini mengikuti pendekatan **MVC (Model-View-Controller)** untuk menjaga arsitektur yang bersih dan mudah dikembangkan.

Template ini sudah mencakup:

- Fitur autentikasi dasar: **Register**, **Login**, dan **Logout**
- Integrasi **frontend-backend** yang langsung siap jalan
- Struktur folder yang terorganisir dengan baik
- Dukungan pengembangan lokal yang cepat dengan Vite + Nodemon

Rencananya ke depan juga akan ditambahkan:

- 🧱 **Reusable UI Components** (komponen siap pakai)
- 🔐 **Multi-session support** (1 akun bisa login di beberapa device)
- ⚙️ Peningkatan sistem konfigurasi agar lebih fleksibel untuk proyek lanjutan

---

## 🧠 Tech Stack

### 🖥️ Frontend

Dibangun menggunakan **Vue 3** dengan dukungan **TypeScript**, **TailwindCSS**, dan **DaisyUI** untuk tampilan modern serta pengembangan yang cepat.

**Utama:**

- Vue 3
- Vue Router
- Pinia
- TailwindCSS
- DaisyUI
- Lucide Icon
- Axios
- VueUse
- Vitest + Cypress (Testing)
- Prettier + ESLint (Code Quality)

**Build Tools:**

- Vite
- TypeScript
- Vue TSC
- npm-run-all2

---

### ⚙️ Backend

Dibangun dengan **Express.js** menggunakan arsitektur modular yang mudah dikembangkan.
Sudah dilengkapi dengan middleware umum seperti keamanan, logging dasar, validasi, dan session handling.

**Utama:**

- Express.js
- Sequelize ORM
- MySQL
- dotenv
- bcryptjs
- jsonwebtoken
- multer
- sharp

**Middleware & Utilities:**

- helmet
- cors
- express-rate-limit
- morgan
- validator
- dayjs
- uuid
- express-session
- body-parser

**Development Tools:**

- Nodemon
- Sequelize CLI

---

## 🗂️ Project Structure

```
starter-web-dev/
├── client/       # Frontend (Vue + Tailwind)
└── server/       # Backend (Express + Sequelize)
```

---

## 👨‍💻 Author

**M. Rifki Aulia Pratama**
[GitHub: Mrifkiauliap](https://github.com/Mrifkiauliap)

---

## 📄 License

Proyek ini dilisensikan di bawah **MIT License**.
Kamu bebas mengubah, memperbaiki, atau mengembangkan repo ini selama tetap mematuhi ketentuan lisensi yang berlaku.

> Feel free to fork, explore, and build something awesome with it! 🚀
