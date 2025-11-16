<script setup lang="ts">
import api from '@/services/api'
import { useLoadingStore } from '@/stores/useLoading'
import { useUserStore } from '@/stores/user'
import { validateEmail, validateName, validatePassword } from '@/utils/validator'
import { EyeClosedIcon, EyeIcon, Upload, X } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3000'
const loadingStore = useLoadingStore()
const userStore = useUserStore()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isLoading = ref(false)
const isSubmitting = ref(false)
const photoPreview = ref<string | null>(null)
const file = ref<File | null>(null)
const showPassword = ref(false)
const showCurrentPassword = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  nama: '',
  email: '',
  current_password: '',
  password: '',
})

// Computed errors
const namaError = computed(() => errors.value.nama || '')
const emailError = computed(() => errors.value.email || '')
const currentPasswordError = computed(() => errors.value.current_password || '')
const passwordError = computed(() => errors.value.password || '')

// Watch loading
watch(isLoading, (val) => {
  loadingStore.setLoading(val)
})

// Function: Close modal
const closeModal = () => {
  if (isSubmitting.value) return
  resetForm()
  emit('close')
}

// Function: Reset form
const resetForm = () => {
  form.value = {
    nama: '',
    email: '',
    current_password: '',
    password: '',
  }

  if (userStore.userPhoto === null) {
    photoPreview.value = userStore.userPhoto
  } else {
    photoPreview.value = API_BASE_URL + userStore.userPhoto
  }

  // Reset errors
  errors.value = {}
}

// Handle file input
const photoChanged = ref(false)
function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const f = target.files?.[0]

  if (f) {
    // Validasi file type
    if (!f.type.match(/^image\/(png|jpeg|jpg)$/)) {
      toast.error('Format file harus PNG atau JPEG')
      return
    }

    // Validasi file size (max 2MB)
    if (f.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB')
      return
    }

    file.value = f
    photoPreview.value = URL.createObjectURL(f)
  }
}

// Remove photo
function removePhoto() {
  file.value = null
  if (userStore.userPhoto === null) {
    photoPreview.value = userStore.userPhoto
  } else {
    photoPreview.value = API_BASE_URL + userStore.userPhoto
  }
}

// Clear error
function clearError(field: string) {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

// Validate form
function validateForm(): boolean {
  errors.value = {}

  const namaValidation = validateName(form.value.nama)
  if (namaValidation) {
    errors.value[namaValidation.field] = namaValidation.message
  }

  const emailValidation = validateEmail(form.value.email)
  if (emailValidation) {
    errors.value[emailValidation.field] = emailValidation.message
  }

  if (!form.value.current_password) {
    errors.value.current_password = 'Password sekarang wajib diisi'
  }

  // Validasi password baru jika diisi
  if (form.value.password) {
    const passwordValidation = validatePassword(form.value.password)
    if (passwordValidation) {
      errors.value[passwordValidation.field] = passwordValidation.message
    }
  }

  return Object.keys(errors.value).length === 0
}

// Submit handler
async function submitForm() {
  if (!validateForm()) {
    const firstError = Object.values(errors.value)[0]
    toast.error(firstError)
    return
  }

  isLoading.value = true
  try {
    const formData = new FormData()
    formData.append('nama', form.value.nama.trim())
    formData.append('email', form.value.email.trim().toLowerCase())
    formData.append('current_password', form.value.current_password)
    if (form.value.password) formData.append('password', form.value.password)
    if (file.value) formData.append('photo', file.value)

    console.log(formData)

    const res = await api.post('/api/auth/edit-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (res.data.error === false) {
      toast.success(res.data.message || 'Profil berhasil diperbarui')

      // Update user store
      userStore.updateUser({
        nama: form.value.nama,
        email: form.value.email,
        profile_picture: res.data.data?.profile_picture || photoPreview.value,
      })

      // Reset form & close modal
      form.value.current_password = ''
      form.value.password = ''
      emit('close')
    }
  } catch (err: any) {
    console.error(err)
    const message = err.response?.data?.message || 'Gagal memperbarui profil'
    toast.error(message)

    if (err.response?.status === 401) {
      errors.value.current_password = 'Password salah'
    }
  } finally {
    isLoading.value = false
  }
}

// Initialize form
onMounted(() => {
  if (userStore.user) {
    if (userStore.userPhoto === null) {
      photoPreview.value = userStore.userPhoto
    } else {
      photoPreview.value = API_BASE_URL + userStore.userPhoto
    }
    form.value.nama = userStore.user.nama
    form.value.email = userStore.user.email
  }
})
</script>

<template>
  <dialog id="edit-profile-modal" class="modal modal-bottom sm:modal-middle" @close="closeModal()">
    <div class="modal-box max-w-lg">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Edit Profil</h3>
        <button type="button" class="btn btn-sm btn-circle btn-ghost" @click="closeModal()">
          <X :size="18" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Photo Upload -->
        <div class="flex flex-col items-center gap-3">
          <div class="avatar">
            <div
              v-if="photoPreview"
              class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
            >
              <img :src="photoPreview" alt="Preview" />
            </div>
            <div
              v-else
              class="w-24 rounded-full bg-primary text-primary-content flex items-center justify-center"
            >
              <span class="text-3xl font-bold">{{ userStore.userInitial }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <label class="btn btn-outline btn-sm">
              <Upload :size="16" />
              Upload Foto
              <input
                type="file"
                accept="image/png,image/jpeg"
                class="hidden"
                @change="handleFileChange"
              />
            </label>
            <button
              v-if="file"
              type="button"
              class="btn btn-outline btn-error btn-sm"
              @click="removePhoto"
            >
              <X :size="16" />
              Hapus
            </button>
          </div>
          <p class="text-xs text-base-content/60">PNG atau JPEG (Max 2MB)</p>
        </div>

        <!-- Nama -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Nama Lengkap</span>
          </label>
          <input
            v-model="form.nama"
            @input="clearError('nama')"
            type="text"
            class="input input-bordered w-full pl-2 focus:input-primary z-10 bg-base-300 border border-base-600"
            :class="{ 'input-error': namaError }"
            placeholder="Nama lengkap"
            required
          />
          <label v-if="namaError" class="label">
            <span class="label-text-alt text-error">{{ namaError }}</span>
          </label>
        </div>

        <!-- Email -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Email</span>
          </label>
          <input
            v-model="form.email"
            @input="clearError('email')"
            type="email"
            class="input input-bordered w-full pl-2 focus:input-primary z-10 bg-base-300 border border-base-600"
            :class="{ 'input-error': emailError }"
            placeholder="Email aktif"
            required
          />
          <label v-if="emailError" class="label">
            <span class="label-text-alt text-error">{{ emailError }}</span>
          </label>
        </div>

        <!-- Current Password -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Password Sekarang</span>
          </label>
          <div class="relative">
            <input
              v-model="form.current_password"
              @input="clearError('current_password')"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="input input-bordered w-full pl-2 focus:input-primary z-10 bg-base-300 border border-base-600"
              :class="{ 'input-error': currentPasswordError }"
              placeholder="Masukkan password saat ini"
              required
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content z-20"
            >
              <div v-if="!showCurrentPassword">
                <eye-closed-icon class="w-5 h-5" />
              </div>
              <div v-else>
                <eye-icon class="w-5 h-5" />
              </div>
            </button>
          </div>
          <label v-if="currentPasswordError" class="label">
            <span class="label-text-alt text-error">{{ currentPasswordError }}</span>
          </label>
        </div>

        <!-- New Password -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Password Baru (Opsional)</span>
          </label>
          <div class="relative">
            <input
              v-model="form.password"
              @input="clearError('password')"
              :type="showPassword ? 'text' : 'password'"
              class="input input-bordered w-full pl-2 focus:input-primary z-10 bg-base-300 border border-base-600"
              :class="{ 'input-error': passwordError }"
              placeholder="Kosongkan jika tidak ingin diubah"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content z-20"
            >
              <div v-if="!showPassword">
                <eye-closed-icon class="w-5 h-5" />
              </div>
              <div v-else>
                <eye-icon class="w-5 h-5" />
              </div>
            </button>
          </div>
          <label class="label">
            <span class="label-text-alt text-base-content/60">Minimal 6 karakter</span>
          </label>
          <label v-if="passwordError" class="label">
            <span class="label-text-alt text-error">{{ passwordError }}</span>
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="modal-action">
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            @click="emit('close')"
            :disabled="isLoading"
          >
            Batal
          </button>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="isLoading">
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Backdrop -->
    <form method="dialog" class="modal-backdrop">
      <button type="button" @click="closeModal()">close</button>
    </form>
  </dialog>
</template>
