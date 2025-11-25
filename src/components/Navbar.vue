<template>
  <header class="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-40">
    <div class="max-w-full px-4 sm:px-6 py-4">
      <div class="flex justify-between items-center">
        <!-- Left: Logo & Menu Items -->
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <router-link to="/" class="hover:opacity-80 transition">
            <h1 class="text-2xl font-bold text-primary">AlienSoft</h1>
          </router-link>

          <!-- Menu Items (Desktop) -->
          <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center space-x-1">
            <router-link
              to="/products"
              class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-gray-700 dark:text-gray-300 text-sm"
              :class="isActive('/products') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10"></path>
              </svg>
              <span>Products</span>
            </router-link>
            <router-link
              to="/products/new"
              class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-gray-700 dark:text-gray-300 text-sm"
              :class="isActive('/products/new') ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Add Product</span>
            </router-link>
          </div>
        </div>

        <!-- Right: Theme Toggle, Mobile Menu Button & Avatar -->
        <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
          <!-- Theme Toggle Button -->
          <button
            @click="toggleTheme"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg v-if="isDark" class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            title="Menu"
          >
            <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <!-- User Avatar with Username -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              :title="`${authStore.user?.firstName} ${authStore.user?.lastName}`"
            >
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-800 text-white flex items-center justify-center font-semibold text-sm">
                {{ initials }}
              </div>
              <span class="hidden sm:inline text-sm font-semibold text-gray-700 dark:text-gray-300">{{ authStore.user?.username }}</span>
            </button>

            <!-- User Dropdown -->
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <!-- User Info -->
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p class="font-semibold text-sm text-gray-900 dark:text-white">
                    {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ authStore.user?.email }}</p>
                </div>

                <!-- Logout -->
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-medium text-red-600 dark:text-red-400 flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 -translate-y-2"
        enter-to-class="transform opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen && authStore.isAuthenticated" class="md:hidden border-t border-gray-200 dark:border-gray-800 mt-4 pt-4 space-y-2">
          <router-link
            to="/products"
            @click="mobileMenuOpen = false"
            class="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium text-gray-700 dark:text-gray-300 text-sm block"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10"></path>
            </svg>
            <span>Products</span>
          </router-link>
          <router-link
            to="/products/new"
            @click="mobileMenuOpen = false"
            class="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium text-gray-700 dark:text-gray-300 text-sm block"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Add Product</span>
          </router-link>
        </div>
      </transition>
    </div>
  </header>

  <!-- Backdrop for closing menus -->
  <div
    v-if="userMenuOpen"
    @click="closeMenus"
    class="fixed inset-0 z-30"
  ></div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const closeMenuTimer = ref(null)

const initials = computed(() => {
  if (!authStore.user) return '?'
  const first = authStore.user.firstName?.charAt(0) || ''
  const last = authStore.user.lastName?.charAt(0) || ''
  return (first + last).toUpperCase()
})

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
  mobileMenuOpen.value = false
}

const closeMenus = () => {
  mobileMenuOpen.value = false
  userMenuOpen.value = false
}

const handleLogout = () => {
  closeMenus()
  authStore.logout()
  router.push('/login')
}

// Auto-close user menu after 15 seconds
watch(userMenuOpen, (newValue) => {
  // Clear existing timer
  if (closeMenuTimer.value) {
    clearTimeout(closeMenuTimer.value)
    closeMenuTimer.value = null
  }
  
  // Set new timer if menu is opened
  if (newValue) {
    closeMenuTimer.value = setTimeout(() => {
      userMenuOpen.value = false
      closeMenuTimer.value = null
    }, 15000) // 15 seconds
  }
})

// Clean up timer on component unmount
onBeforeUnmount(() => {
  if (closeMenuTimer.value) {
    clearTimeout(closeMenuTimer.value)
  }
})
</script>
