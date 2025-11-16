import api from '@/services/api'
import { useLoadingStore } from '@/stores/useLoading'
import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router'

// Lazy load
const HomeView = () => import('@/views/HomeView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const RegisterView = () => import('@/views/RegisterView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')
const AboutView = () => import('@/views/AboutView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.API_BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
  ],
})

// Helper: Cek session
async function checkSession() {
  try {
    const res = await api.get('/api/auth/verify')
    return res.data?.authenticated === true
  } catch {
    return false
  }
}

// Helper: Try refresh token
async function tryRefreshToken() {
  try {
    const res = await api.post('/api/auth/refresh')
    return res.data?.authenticated === true
  } catch {
    return false
  }
}

// Middleware global
router.beforeEach(async (to, from) => {
  const loadingStore = useLoadingStore()
  const userStore = useUserStore()

  loadingStore.setLoading(true)

  // Cek auth hanya sekali untuk semua route
  if (!userStore.isInitialized) {
    const isAuth = await checkSession()

    if (isAuth) {
      await userStore.fetchUser()
    }
  }

  // Halaman guest only (login/register) tapi user sudah login
  if (to.meta.guestOnly && userStore.isAuthenticated) {
    loadingStore.setLoading(false)
    return { path: '/dashboard' }
  }

  // Halaman requiresAuth tapi user belum login
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    loadingStore.setLoading(false)
    userStore.clearUser()
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

router.afterEach(() => {
  const loadingStore = useLoadingStore()
  loadingStore.setLoading(false)
})

export default router
