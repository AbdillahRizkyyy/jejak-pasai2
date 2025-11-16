import { API_BASE_URL } from '@/config/config'
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Wajib untuk cookies
  timeout: 30000, // 30 detik timeout
})

// State untuk refresh token
let isRefreshing = false
let failedRequestsQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

// ===========================
// Request Interceptor
// ===========================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Set Content-Type untuk FormData secara otomatis
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// ===========================
// Response Interceptor
// ===========================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Mengabaikan request ke endpoint auth tertentu agar error message tampil
    const excludedPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/verify']

    const isExcluded = excludedPaths.some((path) => originalRequest.url?.includes(path))

    // Kalau request ke excluded paths, bypass interceptor
    if (isExcluded) {
      return Promise.reject(error)
    }

    // Handle 401/403 (Unauthorized/Forbidden)
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      // Kalau sedang refresh, queue request ini
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Coba refresh token
        await api.post('/api/auth/refresh')

        // Refresh berhasil, retry semua queued requests
        failedRequestsQueue.forEach(({ resolve }) => resolve())
        failedRequestsQueue = []

        // Retry original request
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token gagal, redirect ke login...')

        // Refresh gagal, reject semua queued requests
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError))
        failedRequestsQueue = []

        // Logout (clear cookies di backend)
        try {
          await api.post('/api/auth/logout')
        } catch (logoutError) {
          console.error('Logout error:', logoutError)
        }

        // Redirect ke login
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname
          if (currentPath !== '/login' && currentPath !== '/register') {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
          }
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle 500 (Server Error)
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }

    // Handle Network Error
    if (error.message === 'Network Error') {
      console.error('Network error - Check your internet connection')
    }

    return Promise.reject(error)
  },
)

export default api
