<template>
  <AppLayout>
    <div class="space-y-4 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
        <router-link 
          to="/home"
          class="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all font-medium text-sm sm:text-base shadow-sm hover:shadow-md w-fit"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 4v4m0 0v4m0-4h4m-4 0h-4"></path>
          </svg>
          Back to Dashboard
        </router-link>
      </div>
      
      <!-- Search and Filters Section -->
      <div class="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-lg shadow space-y-3 sm:space-y-4">
        <!-- Search Bar -->
        <input
          v-model="searchQuery"
          @input="handleSearchChange"
          type="text"
          placeholder="Search by title or category..."
          class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        
        <!-- Category Filter and Sorting -->
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <!-- Category Filter with Custom Category Input -->
          <div class="flex-1 relative">
            <select
              v-model="selectedCategory"
              @change="handleFilterChange"
              class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option v-for="cat in categoryOptions" :key="cat" :value="cat">
                {{ displayCategory(cat) }}
              </option>
              <option value="Other">Other</option>
            </select>
            
            <!-- Custom Category Filter Input (shows when "Other" is selected) -->
            <transition name="fade-down">
              <input
                v-if="selectedCategory === 'Other'"
                v-model="customCategoryFilter"
                @input="handleFilterChange"
                type="text"
                placeholder="Filter by custom category..."
                class="w-full mt-2 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </transition>
          </div>
          
          <!-- Sort Dropdown -->
          <select
            v-model="sortBy"
            @change="handleFilterChange"
            class="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="name_asc">Sort: Name A → Z</option>
            <option value="name_desc">Sort: Name Z → A</option>
            <option value="price_low">Sort: Price Low → High</option>
            <option value="price_high">Sort: Price High → Low</option>
            <option value="stock_high">Sort: Stock High → Low</option>
          </select>
        </div>
      </div>
      
      <ErrorMessage :message="productsStore.error" />
      
      <Loader v-if="productsStore.isLoading" />
      
      <ProductTable v-else-if="paginatedProducts.length" :products="paginatedProducts" />
      
      <div v-else class="text-center py-8 sm:py-12 bg-white dark:bg-gray-900 rounded-lg shadow">
        <p class="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No products found</p>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1 && filteredProducts.length" class="flex items-center justify-center gap-2 sm:gap-3 py-6">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div class="flex gap-1 sm:gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition',
              currentPage === page 
                ? 'bg-primary text-white font-semibold' 
                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import AppLayout from '../layouts/AppLayout.vue'
import ProductTable from '../components/ProductTable.vue'
import Loader from '../components/Loader.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

const productsStore = useProductsStore()
const searchQuery = ref('')
const selectedCategory = ref('')
const customCategoryFilter = ref('')
const sortBy = ref('name_asc')
const currentPage = ref(1)
const pageSize = 10

const filteredProducts = computed(() => {
  let products = [...productsStore.products]
  
  // Step 1: Apply search filter (title + category)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(product => {
      const titleMatch = product.title?.toLowerCase().includes(query)
      const categoryMatch = product.category?.toLowerCase().includes(query)
      return titleMatch || categoryMatch
    })
  }
  
  // Step 2: Apply category filter
  if (selectedCategory.value) {
    if (selectedCategory.value === 'Other') {
      // Filter by custom category if custom filter is provided
      if (customCategoryFilter.value) {
        products = products.filter(product => {
          const category = product.category?.toLowerCase() || ''
          const isCustom = !productsStore.categories.includes(category) && category !== ''
          return isCustom && category.includes(customCategoryFilter.value.toLowerCase())
        })
      } else {
        // Show all custom categories (not in store categories list)
        products = products.filter(product => {
          const category = product.category?.toLowerCase() || ''
          return !productsStore.categories.includes(category) && category !== ''
        })
      }
    } else {
      // Filter by exact category (case-insensitive)
      products = products.filter(product => {
        return product.category?.toLowerCase() === selectedCategory.value.toLowerCase()
      })
    }
  }
  
  // Step 3: Apply sorting
  switch (sortBy.value) {
    case 'price_low':
      products.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'price_high':
      products.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    case 'name_asc':
      products.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    case 'name_desc':
      products.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
      break
    case 'stock_high':
      products.sort((a, b) => (b.stock || 0) - (a.stock || 0))
      break
  }
  
  return products
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredProducts.value.slice(start, end)
})

// Reset to page 1 when filters/search change
const handleSearchChange = () => {
  currentPage.value = 1
}

const handleFilterChange = () => {
  currentPage.value = 1
}

// Display category with proper capitalization
const displayCategory = (category) => {
  if (!category) return ''
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
}

// Watch for real-time store changes and ensure dropdown reflects new categories
const categoryOptions = computed(() => {
  return productsStore.categories
})

onMounted(async () => {
  // Only fetch from API if no products are loaded yet
  // This prevents overwriting edits when navigating back to Products page
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
})
</script>

<style scoped>
@keyframes fadeDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-down-enter-active {
  animation: fadeDown 0.2s ease-out;
}

.fade-down-leave-active {
  animation: fadeDown 0.2s ease-in reverse;
}
</style>
