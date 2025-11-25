<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-x-auto border border-gray-100 dark:border-gray-700">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th class="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            Image
          </th>
          <th class="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            Title
          </th>
          <th class="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            Description
          </th>
          <th class="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            Category
          </th>
          <th class="px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            Price
          </th>
          <th class="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            Stock
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <ProductRow 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import ProductRow from './ProductRow.vue'

defineProps({
  products: {
    type: Array,
    required: true
  }
})
</script>
