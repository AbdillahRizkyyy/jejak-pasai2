<script setup lang="ts">
import api from '@/services/api'
import { useUserStore } from '@/stores/user'
import { getDeviceIdentifier, getDeviceType } from '@/utils/device'
import { validateEmail, validatePassword } from '@/utils/validator'
import { EyeClosedIcon, EyeIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const errors = ref<Record<string, string>>({})

const emailError = computed(() => errors.value.email || '')
const passwordError = computed(() => errors.value.password || '')

const validateForm = (): boolean => {
  errors.value = {}

  const emailValidation = validateEmail(email.value)
  if (emailValidation) {
    errors.value[emailValidation.field] = emailValidation.message
  }

  const passwordValidation = validatePassword(password.value)
  if (passwordValidation) {
    errors.value[passwordValidation.field] = passwordValidation.message
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
    const res = await api.post(`/api/auth/login`, {
      email: email.value.trim(),
      password: password.value,
      device_type: getDeviceType(),
      device_identifier: getDeviceIdentifier(),
      device_name: navigator.userAgent,
    })
    console.log(res)

    if (res.data.error === false) {
      const user = res.data.data.user

      // Set user ke store
      userStore.setUser(user)

      toast.success(`Login berhasil! Selamat datang, ${user.nama}`)

      // Redirect ke halaman sebelumnya atau dashboard
      const redirectTo = (route.query.redirect as string) || '/dashboard'
      router.push(redirectTo)
    }
  } catch (err: any) {
    console.error(err)
    const message = err.response?.data?.message || 'Terjadi kesalahan saat login'
    toast.error(message)

    if (err.response?.status === 401) {
      errors.value.password = err.response?.data?.message || 'Email atau password salah'
    }
  } finally {
    isLoading.value = false
  }
}

const clearError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 p-4"
  >
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body">
        <!-- Header -->
        <div class="text-center mb-6">
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Selamat Datang
          </h1>
          <p class="text-base-content/60 mt-2">Silakan login untuk melanjutkan</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="space-y-4">
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
                class="input input-bordered w-full pl-2 pr-10 focus:input-primary z-10 bg-base-300 border border-base-600"
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
            <label v-if="passwordError" class="label">
              <span class="label-text-alt text-error">{{ passwordError }}</span>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
              <span v-if="isLoading" class="loading loading-spinner"></span>
              {{ isLoading ? 'Memproses...' : 'Login' }}
            </button>
          </div>
        </form>

        <!-- Divider -->
        <div class="divider text-base-content/50">atau</div>

        <!-- Register Link -->
        <div class="text-center">
          <p class="text-sm text-base-content/70">
            Belum punya akun?
            <router-link to="/register" class="link link-primary font-semibold">
              Daftar sekarang
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
