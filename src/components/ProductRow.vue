<template>
  <tr 
    @click="handleClick" 
    class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition border-b hover:shadow-sm"
  >
    <td class="px-4 sm:px-6 py-5">
      <img 
        :src="product.thumbnail" 
        :alt="product.title" 
        class="w-11 h-11 sm:w-13 sm:h-13 rounded-lg object-cover shadow-sm"
      />
    </td>
    <td class="px-4 sm:px-6 py-5 font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{{ product.title }}</td>
    <td class="hidden lg:table-cell px-4 sm:px-6 py-5 text-gray-600 dark:text-gray-400 text-sm">{{ truncate(product.description, 80) }}</td>
    <td class="px-4 sm:px-6 py-5">
      <span class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg text-xs sm:text-sm font-medium">
        {{ displayCategory(product.category) }}
      </span>
    </td>
    <td class="px-4 sm:px-6 py-5 font-bold text-primary text-sm sm:text-base">{{ priceInKES(product.price) }}</td>
    <td class="hidden sm:table-cell px-4 sm:px-6 py-5 text-sm font-semibold" :class="stockClass">{{ product.stock }} {{ product.unit || 'units' }}</td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { truncate } from '../utils/truncate'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const productsStore = useProductsStore()

const stockClass = computed(() => {
  return props.product.stock > 50 ? 'text-green-600' : 
         props.product.stock > 0 ? 'text-orange-600' : 
         'text-red-600'
})

const priceInKES = computed(() => {
  return (price) => {
    if (!price) return 'KES 0.00'
    const kesAmount = (price * productsStore.currentRate).toFixed(2)
    const [wholePart, decimalPart] = kesAmount.split('.')
    const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return 'KES ' + formattedWhole + '.' + decimalPart
  }
})

// Format and display category with proper capitalization
const displayCategory = (category) => {
  if (!category) return ''
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
}

const handleClick = () => {
  router.push(`/products/${props.product.id}`)
}
</script>
