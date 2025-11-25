<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <div class="mb-6 sm:mb-8 flex flex-wrap gap-3">
        <button 
          @click="router.push('/products')" 
          class="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium text-sm sm:text-base border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm hover:shadow"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Products
        </button>
        <button 
          @click="router.push('/home')" 
          class="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all font-medium text-sm sm:text-base shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 4v4m0 0v4m0-4h4m-4 0h-4"></path>
          </svg>
          Dashboard
        </button>
      </div>
      
      <ErrorMessage :message="productsStore.error" />
      
      <Loader v-if="productsStore.isLoading" />
      
      <div v-else-if="product" class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/3 p-6 sm:p-8 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <img 
              :src="product.thumbnail" 
              :alt="product.title" 
              class="w-full max-w-xs rounded-lg shadow"
            />
          </div>
          
          <div class="md:w-2/3 p-6 sm:p-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ product.title }}</h1>
            
            <div class="space-y-3 sm:space-y-4">
              <div>
                <span class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Category:</span>
                <span class="ml-2 px-2 sm:px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-full text-xs sm:text-sm">
                  {{ displayCategory(product.category) }}
                </span>
              </div>
              
              <div>
                <span class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Price:</span>
                <span class="ml-2 text-xl sm:text-2xl font-bold text-primary">{{ priceInKES(product.price) }}</span>
              </div>
              
              <div>
                <span class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Stock:</span>
                <span class="ml-2 font-semibold text-sm sm:text-base" :class="stockClass">
                  {{ product.stock }} {{ product.unit || 'units' }}
                </span>
              </div>
              
              <div v-if="product.rating">
                <span class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Rating:</span>
                <span class="ml-2 font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-300">{{ product.rating }} / 5</span>
              </div>
              
              <div v-if="product.discountPercentage">
                <span class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Discount:</span>
                <span class="ml-2 text-green-600 dark:text-green-400 font-semibold text-sm sm:text-base">{{ product.discountPercentage }}% off</span>
              </div>
              
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h2 class="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">Description</h2>
                <p class="text-gray-700 dark:text-gray-400 leading-relaxed text-sm sm:text-base">{{ product.description }}</p>
              </div>
            </div>
            
            <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                @click="router.push(`/products/${product.id}/edit`)"
                class="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-80 transition text-sm sm:text-base"
              >
                Edit Product
              </button>
              <button
                @click="handleDelete"
                :disabled="isDeleting"
                class="bg-red-600 dark:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition disabled:opacity-50 text-sm sm:text-base"
              >
                {{ isDeleting ? 'Deleting...' : 'Delete Product' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 sm:py-12 bg-white dark:bg-gray-900 rounded-lg shadow">
        <p class="text-gray-500 dark:text-gray-400 text-base sm:text-lg">Product not found</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import AppLayout from '../layouts/AppLayout.vue'
import Loader from '../components/Loader.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const product = ref(null)
const isDeleting = ref(false)

const stockClass = computed(() => {
  if (!product.value) return ''
  return product.value.stock > 50 ? 'text-green-600' : 
         product.value.stock > 0 ? 'text-orange-600' : 
         'text-red-600'
})

// Display category with proper capitalization (first letter uppercase, rest lowercase)
const displayCategory = (category) => {
  if (!category) return ''
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
}

const priceInKES = (price) => {
  if (!price) return 'KES 0.00'
  const kesAmount = (price * productsStore.currentRate).toFixed(2)
  const [wholePart, decimalPart] = kesAmount.split('.')
  const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return 'KES ' + formattedWhole + '.' + decimalPart
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return
  }
  
  isDeleting.value = true
  const result = await productsStore.deleteProduct(product.value.id)
  
  if (result.success) {
    router.push('/products')
  }
  
  isDeleting.value = false
}

onMounted(async () => {
  const id = route.params.id
  const numericId = Number(id)
  
  // STORE-FIRST approach: Always check local store first, never refetch after edits
  // 1. Check store.products array (this has the latest edits from localStorage)
  const found = productsStore.products.find(p => p.id === numericId)
  if (found) {
    product.value = found
    productsStore.currentProduct = found
    return
  }
  
  // 2. Check currentProduct (fallback, might be stale)
  if (productsStore.currentProduct && productsStore.currentProduct.id === numericId) {
    product.value = productsStore.currentProduct
    return
  }
  
  // 3. Only fetch from API if absolutely not found in store
  // (This is a fresh page load scenario only)
  product.value = await productsStore.fetchProductById(id)
})
</script>
