<template>
  <Toast />
  <router-view />
</template>

<script setup>
import { useTheme } from './composables/useTheme'
import { useProductsStore } from './stores/products'
import { onMounted } from 'vue'
import Toast from './components/Toast.vue'

const { initTheme } = useTheme()
const productsStore = useProductsStore()

onMounted(async () => {
  initTheme()
  
  // If no products loaded yet, restore from localStorage or fetch from API
  if (productsStore.products.length === 0) {
    await productsStore.restoreFromLocalStorage()
  }
})
</script>
