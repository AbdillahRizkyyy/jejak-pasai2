import { API_BASE_URL } from '@/config/config'
import axios from 'axios'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // biar cookie otomatis dikirim
})

let isRefreshing = false
let failedRequestsQueue: Array<(success: boolean) => void> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Mengabaikan request ke login/register agar pesan request error tampil
    const excludedPaths = ['/api/auth/login', '/api/auth/register']
    const isExcluded = excludedPaths.some((path) => originalRequest.url?.includes(path))

    if (isExcluded) {
      // kalau request ke login/register error, biarin aja lewat
      return Promise.reject(error)
    }

    // Handle token expired
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push((success) => {
            if (success) resolve(api(originalRequest))
            else reject(error)
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await api.post('/api/auth/refresh')

        failedRequestsQueue.forEach((cb) => cb(true))
        failedRequestsQueue = []

        return api(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token gagal, redirect ke login...')
        try {
          await api.post('/api/auth/logout')
        } catch {}

        failedRequestsQueue.forEach((cb) => cb(false))
        failedRequestsQueue = []

        window.location.href = '/'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
