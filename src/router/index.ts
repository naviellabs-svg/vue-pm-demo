import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const publicPaths = ['/', '/login', '/register', '/readme']

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.getSession()
  const isPublic = publicPaths.includes(to.path)

  if (!authStore.user && !isPublic) {
    return { path: '/' }
  }

  if (authStore.user && (to.path === '/' || to.path === '/login' || to.path === '/register')) {
    return { path: '/dashboard' }
  }
})
export default router
