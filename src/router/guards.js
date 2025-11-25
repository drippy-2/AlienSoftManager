import { useAuthStore } from '../stores/auth'

export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/products')
  } else {
    next()
  }
}
