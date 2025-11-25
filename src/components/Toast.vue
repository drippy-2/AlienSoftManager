<template>
  <div class="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
    <transition-group name="toast-slide" tag="div">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :class="[
          'px-6 py-4 rounded-lg shadow-lg font-medium text-white flex items-center gap-3 animate-slide-in',
          notification.type === 'success' ? 'bg-green-500 dark:bg-green-600' : '',
          notification.type === 'error' ? 'bg-red-500 dark:bg-red-600' : '',
          notification.type === 'info' ? 'bg-blue-500 dark:bg-blue-600' : ''
        ]"
      >
        <!-- Icon based on type -->
        <svg 
          v-if="notification.type === 'success'"
          class="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        
        <svg 
          v-else-if="notification.type === 'error'"
          class="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        
        <svg 
          v-else
          class="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        
        <span class="flex-1 text-sm sm:text-base">{{ notification.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../stores/notifications'

const notificationStore = useNotificationStore()
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translateX(400px);
  opacity: 0;
}
</style>
