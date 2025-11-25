import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../pages/Products.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/new',
    name: 'AddProduct',
    component: () => import('../pages/AddProduct.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id/edit',
    name: 'EditProduct',
    component: () => import('../pages/EditProduct.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id',
    name: 'ViewProduct',
    component: () => import('../pages/ViewProduct.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(authGuard)

export default router
