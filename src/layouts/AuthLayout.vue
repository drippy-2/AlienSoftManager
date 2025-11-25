<template>
  <div class="min-h-screen bg-gradient-to-br from-primary to-blue-900 dark:from-gray-950 dark:to-gray-900 flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Footer from '../components/Footer.vue'
</script>
