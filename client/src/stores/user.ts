import api from '@/services/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface User {
  id: number
  nama: string
  email: string
  is_active: boolean
  profile_picture: string | null
  createdAt: string
  devices?: any
}

export const useUserStore = defineStore('auth_user', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => user.value !== null)
  const userName = computed(() => user.value?.nama || '')
  const userEmail = computed(() => user.value?.email || '')
  const userInitial = computed(() => user.value?.nama.charAt(0).toUpperCase() || 'U')
  const userPhoto = computed(() => user.value?.profile_picture || null)

  // Actions
  const fetchUser = async () => {
    if (isLoading.value) return // Prevent multiple calls

    isLoading.value = true
    try {
      const res = await api.get('/api/auth/me')
      if (res.data.error === false) {
        user.value = res.data.data
        isInitialized.value = true
        return res.data.data
      }
    } catch (err) {
      console.error('Failed to fetch user:', err)
      user.value = null
      isInitialized.value = true
    } finally {
      isLoading.value = false
    }
    return null
  }

  const setUser = (userData: User) => {
    user.value = userData
    isInitialized.value = true
  }

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  const clearUser = () => {
    user.value = null
    isInitialized.value = false
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
      clearUser()
      return true
    } catch (err) {
      console.error('Logout error:', err)
      return false
    }
  }

  const logoutAll = async () => {
    try {
      await api.post('/api/auth/logout-all')
      clearUser()
      return true
    } catch (err) {
      console.error('Logout all error:', err)
      return false
    }
  }

  return {
    // State
    user,
    isLoading,
    isInitialized,
    // Getters
    isAuthenticated,
    userName,
    userEmail,
    userInitial,
    userPhoto,
    // Actions
    fetchUser,
    setUser,
    updateUser,
    clearUser,
    logout,
    logoutAll,
  }
})
