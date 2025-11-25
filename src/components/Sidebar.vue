<template>
  <div>
    <div 
      v-if="isOpen" 
      @click="toggleSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
    ></div>

    <aside 
      :class="[
        'fixed md:static md:translate-x-0 left-0 top-0 h-screen w-64 bg-gradient-to-b from-primary to-blue-900 dark:from-gray-900 dark:to-black text-white shadow-2xl z-40 transition-transform duration-300 transform overflow-y-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold">Menu</h2>
          <button 
            @click="toggleSidebar"
            class="md:hidden text-white hover:opacity-80 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav class="space-y-3">
          <router-link 
            to="/home"
            @click="closeSidebar"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition font-medium"
            :class="{ 'bg-white bg-opacity-20': $route.path === '/home' }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1V9m-9 9l-7-4"></path>
            </svg>
            <span>Home</span>
          </router-link>

          <router-link 
            to="/products"
            @click="closeSidebar"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition font-medium"
            :class="{ 'bg-white bg-opacity-20': $route.path === '/products' || $route.path.startsWith('/products') }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10"></path>
            </svg>
            <span>Products</span>
          </router-link>

          <router-link 
            to="/products/new"
            @click="closeSidebar"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition font-medium"
            :class="{ 'bg-white bg-opacity-20': $route.path === '/products/new' }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Add Product</span>
          </router-link>
        </nav>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const isOpen = ref(false)
const route = useRoute()

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}
</script>
