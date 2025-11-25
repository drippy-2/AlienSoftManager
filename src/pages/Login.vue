<template>
  <AuthLayout>
    <div class="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">AlienSoft</h1>
        <p class="text-gray-600 dark:text-gray-400">Product Management System</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <ErrorMessage :message="error" />
        
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Enter your username"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Enter your password"
          />
        </div>
        
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:opacity-80 transition disabled:opacity-50"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">🔐 AlienSoft Admin Portal</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Secure login for authorized administrators only</p>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthLayout from '../layouts/AuthLayout.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  const result = await authStore.login(username.value, password.value)
  
  if (result.success) {
    router.push('/home')
  } else {
    error.value = result.error
  }
  
  isLoading.value = false
}
</script>
