<template>
  <div v-if="message" class="bg-red-50 dark:bg-red-950 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String
})
</script>
