<script setup lang="ts">
// Componen
import ButtonDarkmode from '@/components/Button/ButtonDarkmode.vue'
import ModalProfile from '@/modules/Dashboard/widget/ModalProfile.vue'

// Composable
import { useModal } from '@/composables/useModal'

// Store
import { useUserStore } from '@/stores/user'

// Library
import dayjs from 'dayjs'
import { Home, LogOut, Settings, User } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3000'

const editModal = useModal('edit-profile-modal')
const userStore = useUserStore()
const router = useRouter()

// Fetch user jika belum ada (fallback)
onMounted(async () => {
  if (!userStore.isInitialized) {
    await userStore.fetchUser()
  }
  console.log(userStore.user)
})

const handleLogout = async () => {
  const success = await userStore.logout()
  if (success) {
    toast.success('Logout berhasil')
    router.push('/login')
  } else {
    toast.error('Gagal logout')
  }
}

const handleLogoutAll = async () => {
  const success = await userStore.logoutAll()
  if (success) {
    toast.success('Logout dari semua device berhasil')
    router.push('/login')
  } else {
    toast.error('Gagal logout')
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-base-100 rounded-lg shadow-xl p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">Dashboard</h1>
            <p v-if="userStore.user" class="text-base-content/60 mt-1">
              Selamat datang, {{ userStore.userName }}!
            </p>
          </div>

          <div class="flex items-center gap-2">
            <!-- Dark Mode Toggle -->
            <ButtonDarkmode />

            <!-- User Dropdown -->
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                <div
                  v-if="userStore.userPhoto"
                  class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                >
                  <img :src="API_BASE_URL + userStore.userPhoto" :alt="userStore.userName" />
                </div>
                <div
                  v-else
                  class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center"
                >
                  <span class="text-lg font-bold">{{ userStore.userInitial }}</span>
                </div>
              </label>
              <ul
                tabindex="0"
                class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a @click="editModal.open()" class="flex items-center gap-2">
                    <User :size="16" />
                    Edit Profile
                  </a>
                </li>
                <li>
                  <a class="flex items-center gap-2">
                    <Settings :size="16" />
                    Settings
                  </a>
                </li>
                <div class="divider my-1"></div>
                <li>
                  <a @click="handleLogout" class="flex items-center gap-2">
                    <LogOut :size="16" />
                    Logout
                  </a>
                </li>
                <li>
                  <a @click="handleLogoutAll" class="text-error flex items-center gap-2">
                    <LogOut :size="16" />
                    Logout Semua Device
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="userStore.isLoading" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <!-- User Info -->
      <div v-else-if="userStore.user" class="grid gap-6 md:grid-cols-2">
        <!-- Info Card -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Informasi Akun</h2>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-base-content/60">Nama</p>
                <p class="font-semibold">{{ userStore.userName }}</p>
              </div>
              <div>
                <p class="text-sm text-base-content/60">Email</p>
                <p class="font-semibold">{{ userStore.userEmail }}</p>
              </div>
              <div>
                <p class="text-sm text-base-content/60">Status</p>
                <div
                  class="badge"
                  :class="userStore.user.is_active ? 'badge-success' : 'badge-error'"
                >
                  {{ userStore.user.is_active ? 'Aktif' : 'Tidak Aktif' }}
                </div>
              </div>
              <div>
                <p class="text-sm text-base-content/60">Terdaftar Sejak</p>
                <p class="font-semibold">
                  {{ dayjs(userStore.user.createdAt).locale('id').format('D MMMM YYYY') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Aksi Cepat</h2>
            <div class="grid grid-cols-2 gap-2">
              <RouterLink to="/" class="btn btn-outline w-full">
                <Home :size="18" />
                Beranda
              </RouterLink>
              <button class="btn btn-outline w-full" @click="editModal.open()">
                <User :size="18" />
                Edit Profile
              </button>
              <button class="btn btn-outline w-full">
                <Settings :size="18" />
                Settings
              </button>
              <button @click="handleLogout" class="btn btn-outline btn-error w-full">
                <LogOut :size="18" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Edit Profile -->
  <ModalProfile @close="editModal.close()" />
</template>
