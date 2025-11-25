<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
    <Navbar />
    <div class="flex flex-1">
      <Sidebar ref="sidebarRef" />
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import Footer from '../components/Footer.vue'

const sidebarRef = ref(null)

const toggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggleSidebar?.()
  }
}

provide('toggleSidebar', toggleSidebar)
</script>
