<template>
  <AppLayout>
    <div class="space-y-8">
      <!-- Dashboard Header with Welcome Message -->
      <div class="bg-gradient-to-r from-primary to-blue-900 dark:from-gray-900 dark:to-black text-white rounded-xl p-8 shadow-lg">
        <h1 class="text-3xl sm:text-4xl font-bold mb-2">
          Welcome back, {{ userName }}! 👋
        </h1>
        <p class="text-blue-100 dark:text-gray-400 text-lg">Here's today's product overview.</p>
      </div>

      <!-- Analytics KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- Total Products Card -->
        <router-link 
          to="/products"
          class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold text-sm">Total Products</h3>
            <div class="text-3xl group-hover:scale-110 transition-transform">📦</div>
          </div>
          <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">{{ formattedTotalProducts }}</div>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ productsStore.totalProducts === 1 ? 'product' : 'products' }} in inventory</p>
        </router-link>

        <!-- Total Stock Card -->
        <router-link 
          to="/products"
          class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold text-sm">Total Stock</h3>
            <div class="text-3xl group-hover:scale-110 transition-transform">🏷️</div>
          </div>
          <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">{{ formattedTotalStock }}</div>
          <p class="text-sm text-gray-600 dark:text-gray-400">units available</p>
        </router-link>

        <!-- Inventory Value Card -->
        <router-link 
          to="/products"
          class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold text-sm">Inventory Value</h3>
            <div class="text-3xl group-hover:scale-110 transition-transform">💰</div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white mb-2 break-words">{{ productsStore.inventoryValueKES }}</div>
          <p class="text-sm text-gray-600 dark:text-gray-400">total value in KES</p>
        </router-link>
      </div>

      <!-- Low Stock Alerts Section -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-2xl">⚠️</div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Low Stock Alerts</h2>
        </div>
        
        <div v-if="productsStore.lowStockItems.length" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Product Name</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Stock Level</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in productsStore.lowStockItems" :key="product.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td class="py-3 px-4">
                  <router-link :to="`/products/${product.id}`" class="text-primary font-semibold hover:underline">
                    {{ product.title }}
                  </router-link>
                </td>
                <td class="py-3 px-4 font-semibold text-gray-900 dark:text-white">{{ product.stock }} {{ product.unit || 'units' }}</td>
                <td class="py-3 px-4">
                  <span 
                    v-if="product.stock < 5"
                    class="inline-block bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    🔴 Critical
                  </span>
                  <span 
                    v-else
                    class="inline-block bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    🟡 Low
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          ✓ All products have healthy stock levels!
        </div>
      </div>

      <!-- Category Distribution Chart -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Category Distribution</h2>
        
        <div v-if="productsStore.categoryDistribution.length" class="space-y-4">
          <div v-for="category in productsStore.categoryDistribution" :key="category.category" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-gray-700 dark:text-gray-300 capitalize">{{ category.category }}</span>
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ category.count }} products ({{ category.percent }}%)</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-primary to-blue-700 h-3 rounded-full transition-all"
                :style="{ width: category.percent + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          No category data available
        </div>
      </div>

      <!-- Top Products by Stock -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Products by Stock</h2>
        <div v-if="productsStore.topProductsByStock(5).length" class="space-y-4">
          <div 
            v-for="product in productsStore.topProductsByStock(5)" 
            :key="product.id"
            class="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary transition cursor-pointer"
            @click="goToProduct(product.id)"
          >
            <div class="flex items-center space-x-4 flex-1 min-w-0">
              <img :src="product.thumbnail" :alt="product.title" class="w-12 h-12 rounded-lg object-cover flex-shrink-0">
              <div class="min-w-0">
                <p class="font-semibold text-gray-900 dark:text-white truncate">{{ product.title }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ product.category }}</p>
              </div>
            </div>
            <div class="text-right ml-4">
              <p class="font-semibold text-gray-900 dark:text-white">{{ product.stock }} {{ product.unit || 'units' }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ priceInKES(product.price) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          No products available
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useAuthStore } from '../stores/auth'
import AppLayout from '../layouts/AppLayout.vue'

const router = useRouter()
const productsStore = useProductsStore()
const authStore = useAuthStore()

// Welcome message with user's name
const userName = computed(() => {
  if (authStore.user?.firstName) {
    return authStore.user.firstName
  }
  return 'Admin'
})

// Formatted Total Products with commas
const formattedTotalProducts = computed(() => {
  return productsStore.totalProducts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

// Formatted Total Stock with commas
const formattedTotalStock = computed(() => {
  return productsStore.totalStock.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

// Price to KES conversion
const priceInKES = (price) => {
  if (!price) return 'KES 0.00'
  const kesAmount = (price * productsStore.currentRate).toFixed(2)
  const [wholePart, decimalPart] = kesAmount.split('.')
  const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return 'KES ' + formattedWhole + '.' + decimalPart
}

// Navigate to product details
const goToProduct = (productId) => {
  router.push(`/products/${productId}`)
}

// Restore products from localStorage on mount
onMounted(async () => {
  await productsStore.restoreFromLocalStorage()
})
</script>
