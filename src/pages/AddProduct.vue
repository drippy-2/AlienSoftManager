<template>
  <AppLayout>
    <!-- Error Animation on Left Side -->
    <transition name="slide-in-left">
      <div v-if="validationError" class="fixed left-4 top-20 sm:left-8 sm:top-24 bg-red-500 dark:bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm animate-pulse z-50">
        🔴 {{ validationError }}
      </div>
    </transition>

    <!-- Success Animation at Bottom -->
    <transition name="slide-up">
      <div v-if="successMessage" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 dark:bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg text-sm font-medium max-w-sm animate-bounce z-50">
        ✓ {{ successMessage }}
      </div>
    </transition>

    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Add New Product</h1>
      
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8">
        <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
          <ErrorMessage :message="productsStore.error" />
          
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter product title"
            />
          </div>
          
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter product description"
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category <span class="text-red-500">*</span>
              </label>
              <select
                id="category"
                v-model="selectedCategory"
                class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">-- Select a category --</option>
                <option v-for="cat in productsStore.categories" :key="cat" :value="cat">
                  {{ displayCategory(cat) }}
                </option>
                <option value="Other">Other</option>
              </select>
              
              <!-- Custom Category Input (shows when "Other" is selected) -->
              <transition name="fade-down">
                <div v-if="selectedCategory === 'Other'" class="mt-3">
                  <input
                    v-model="form.category"
                    type="text"
                    placeholder="Enter custom category"
                    class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter a custom category name</p>
                </div>
              </transition>
            </div>
            
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (USD)
              </label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="0.00"
              />
              <div v-if="form.price" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Converts to: <span class="font-semibold text-primary">{{ priceInKES }}</span>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stock
              </label>
              <input
                id="stock"
                v-model.number="form.stock"
                type="number"
                min="0"
                class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="0"
              />
            </div>
            
            <div>
              <label for="unit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Measurement Unit
              </label>
              <select
                id="unit"
                v-model="form.unit"
                class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option v-for="u in measurementUnits" :key="u.value" :value="u.value">
                  {{ u.label }}
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label for="thumbnail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail URL
            </label>
            <input
              id="thumbnail"
              v-model="form.thumbnail"
              type="text"
              class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="https://example.com/image.jpg (or upload below)"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional if image is uploaded</p>
          </div>

          <!-- Image Upload Field -->
          <div>
            <label for="imageUpload" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPEG, WEBP (Max 3MB)</p>
            <transition name="fade-down">
              <p v-if="uploadError" class="text-xs text-red-500 dark:text-red-400 mt-2">{{ uploadError }}</p>
            </transition>
            <!-- Image Preview -->
            <transition name="fade-down">
              <div v-if="imagePreviewUrl" class="mt-3">
                <img
                  :src="imagePreviewUrl"
                  alt="Preview"
                  class="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded border dark:border-gray-600"
                  @error="imagePreviewUrl = '/fallback.jpg'"
                />
              </div>
            </transition>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              :disabled="productsStore.isLoading"
              class="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:opacity-80 transition disabled:opacity-50 text-sm sm:text-base"
            >
              {{ productsStore.isLoading ? 'Adding...' : 'Add Product' }}
            </button>
            <button
              type="button"
              @click="router.push('/products')"
              class="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

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

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fade-down-enter-active {
  animation: fadeDown 0.2s ease-out;
}

.fade-down-leave-active {
  animation: fadeDown 0.2s ease-in reverse;
}

.slide-in-left-enter-active {
  animation: slideInLeft 0.3s ease-out;
}

.slide-in-left-leave-active {
  animation: slideInLeft 0.3s ease-in reverse;
}

.slide-up-enter-active {
  animation: slideUp 0.3s ease-out;
}

.slide-up-leave-active {
  animation: slideUp 0.3s ease-in reverse;
}
</style>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useNotificationStore } from '../stores/notifications'
import { MEASUREMENT_UNITS } from '../utils/units'
import { uploadImage, getImagePreviewUrl } from '../utils/imageUpload'
import AppLayout from '../layouts/AppLayout.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

const router = useRouter()
const productsStore = useProductsStore()
const measurementUnits = MEASUREMENT_UNITS
const selectedCategory = ref('')
const validationError = ref('')
const successMessage = ref('')
const uploadError = ref('')
const imagePreviewUrl = ref('')
const uploadedImageBase64 = ref('') // Track successful upload (base64)

const form = reactive({
  title: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  unit: 'units',
  thumbnail: ''
})

// Display category with proper capitalization
const displayCategory = (category) => {
  if (!category) return ''
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
}

const priceInKES = computed(() => {
  if (!form.price) return 'KES 0.00'
  const kesAmount = (form.price * productsStore.currentRate).toFixed(2)
  const [wholePart, decimalPart] = kesAmount.split('.')
  const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return 'KES ' + formattedWhole + '.' + decimalPart
})

const handleSubmit = async () => {
  validationError.value = ''
  successMessage.value = ''
  
  // Validation: Check required fields
  if (!form.title.trim()) {
    validationError.value = 'Please enter a product title'
    clearErrorAfterDelay()
    return
  }
  
  if (!form.description.trim()) {
    validationError.value = 'Please enter a product description'
    clearErrorAfterDelay()
    return
  }
  
  // Check if category selected (either predefined or custom)
  if (!selectedCategory.value || selectedCategory.value === '') {
    validationError.value = 'Please select a category'
    clearErrorAfterDelay()
    return
  }
  
  // If "Other" selected, validate custom category is entered
  if (selectedCategory.value === 'Other' && !form.category.trim()) {
    validationError.value = 'Please enter a custom category name'
    clearErrorAfterDelay()
    return
  }
  
  // Validation: Check if either thumbnail URL OR uploaded image exists
  if (!form.thumbnail.trim() && !uploadedImageBase64.value) {
    validationError.value = 'Please provide a thumbnail URL or upload an image'
    clearErrorAfterDelay()
    return
  }
  
  // Determine final category
  const finalCategory = selectedCategory.value === 'Other' ? form.category.toLowerCase() : selectedCategory.value
  
  // Update form with final category
  form.category = finalCategory
  
  // If user uploaded an image, use Base64 as thumbnail (takes priority over URL)
  if (uploadedImageBase64.value) {
    form.thumbnail = uploadedImageBase64.value
  }
  
  const result = await productsStore.addProduct(form)
  
  if (result.success) {
    // Show floating toast notification
    const notificationStore = useNotificationStore()
    notificationStore.addNotification('Product added successfully!', 'success', 3000)
    
    // Redirect to the new product's detail page
    // Wait a brief moment to ensure data is saved
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push(`/products/${result.data.id}`)
  } else {
    validationError.value = result.error || 'Failed to add product'
    clearErrorAfterDelay()
  }
}

const clearErrorAfterDelay = () => {
  setTimeout(() => {
    validationError.value = ''
  }, 3000)
}

const handleImageUpload = async (event) => {
  uploadError.value = ''
  const file = event.target.files?.[0]
  
  if (!file) return

  const result = await uploadImage(file)
  
  if (result.success) {
    // Track base64 encoded image (will be used as thumbnail in form submission)
    uploadedImageBase64.value = result.base64
    // Update preview URL to show uploaded image immediately
    imagePreviewUrl.value = result.dataUrl
    // Clear any previous errors
    uploadError.value = ''
  } else {
    uploadError.value = result.error
    uploadedImageBase64.value = '' // Clear on error
    // Clear error after 3 seconds
    setTimeout(() => {
      uploadError.value = ''
    }, 3000)
  }
}
</script>
