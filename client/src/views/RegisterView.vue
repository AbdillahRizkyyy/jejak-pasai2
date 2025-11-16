<script setup lang="ts">
import api from '@/services/api'
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
} from '@/utils/validator'
import { EyeClosedIcon, EyeIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const nama = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const errors = ref<Record<string, string>>({})

// Real-time validation
const namaError = computed(() => errors.value.nama || '')
const emailError = computed(() => errors.value.email || '')
const passwordError = computed(() => errors.value.password || '')
const passwordConfirmError = computed(() => errors.value.passwordConfirm || '')

const validateForm = (): boolean => {
  errors.value = {}

  const namaValidation = validateName(nama.value)
  if (namaValidation) {
    errors.value[namaValidation.field] = namaValidation.message
  }

  const emailValidation = validateEmail(email.value)
  if (emailValidation) {
    errors.value[emailValidation.field] = emailValidation.message
  }

  const passwordValidation = validatePassword(password.value)
  if (passwordValidation) {
    errors.value[passwordValidation.field] = passwordValidation.message
  }

  const passwordMatchValidation = validatePasswordMatch(password.value, passwordConfirm.value)
  if (passwordMatchValidation) {
    errors.value[passwordMatchValidation.field] = passwordMatchValidation.message
  }

  return Object.keys(errors.value).length === 0
}

const onSubmit = async () => {
  if (!validateForm()) {
    const firstError = Object.values(errors.value)[0]
    toast.error(firstError as string)
    return
  }

  isLoading.value = true
  try {
    const res = await api.post('/api/auth/register', {
      nama: nama.value.trim(),
      email: email.value.trim(),
      password: password.value,
    })

    if (res.data.error === false) {
      toast.success('Registrasi berhasil! Silakan login')
      router.push('/login')
    }
  } catch (err: any) {
    console.error(err)
    const message = err.response?.data?.message || 'Terjadi kesalahan saat registrasi'
    toast.error(message)

    // Set error dari backend
    if (err.response?.status === 400 && message.includes('Email')) {
      errors.value.email = message
    }
  } finally {
    isLoading.value = false
  }
}

// Clear error saat user mengetik
const clearError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/10 via-base-200 to-primary/10"
  >
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body">
        <!-- Header -->
        <div class="text-center mb-6">
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
          >
            Daftar Akun Baru
          </h1>
          <p class="text-base-content/60 mt-2">Isi data diri Anda untuk mendaftar</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Nama Input -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Nama Lengkap</span>
            </label>
            <input
              v-model="nama"
              @input="clearError('nama')"
              type="text"
              placeholder="John Doe"
              class="input input-bordered w-full pl-2 focus:input-primary bg-base-300 border border-base-600"
              :class="{ 'input-error': namaError }"
              required
            />
            <label v-if="namaError" class="label">
              <span class="label-text-alt text-error">{{ namaError }}</span>
            </label>
          </div>

          <!-- Email Input -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Email</span>
            </label>
            <input
              v-model="email"
              @input="clearError('email')"
              type="email"
              placeholder="email@example.com"
              class="input input-bordered w-full pl-2 focus:input-primary bg-base-300 border border-base-600"
              :class="{ 'input-error': emailError }"
              required
            />
            <label v-if="emailError" class="label">
              <span class="label-text-alt text-error">{{ emailError }}</span>
            </label>
          </div>

          <!-- Password Input -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Password</span>
            </label>
            <div class="relative">
              <input
                v-model="password"
                @input="clearError('password')"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input input-bordered w-full pl-2 pr-10 focus:input-primary bg-base-300 border border-base-600 z-10"
                :class="{ 'input-error': passwordError }"
                required
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

          <!-- Confirm Password Input -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Konfirmasi Password</span>
            </label>
            <div class="relative">
              <input
                v-model="passwordConfirm"
                @input="clearError('passwordConfirm')"
                :type="showPasswordConfirm ? 'text' : 'password'"
                placeholder="••••••••"
                class="input input-bordered w-full pl-2 pr-10 focus:input-primary bg-base-300 border border-base-600 z-10"
                :class="{ 'input-error': passwordConfirmError }"
                required
              />
              <button
                type="button"
                @click="showPasswordConfirm = !showPasswordConfirm"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content z-20"
              >
                <div v-if="!showPasswordConfirm">
                  <eye-closed-icon class="w-5 h-5" />
                </div>
                <div v-else>
                  <eye-icon class="w-5 h-5" />
                </div>
              </button>
            </div>
            <label v-if="passwordConfirmError" class="label">
              <span class="label-text-alt text-error">{{ passwordConfirmError }}</span>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
              <span v-if="isLoading" class="loading loading-spinner"></span>
              {{ isLoading ? 'Mendaftar...' : 'Daftar' }}
            </button>
          </div>
        </form>

        <!-- Divider -->
        <div class="divider text-base-content/50">atau</div>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-sm text-base-content/70">
            Sudah punya akun?
            <router-link to="/login" class="link link-primary font-semibold">
              Login sekarang
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
