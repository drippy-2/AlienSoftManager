import { defineStore } from 'pinia'
import { productsAPI } from '../utils/api'

const STORAGE_KEY = 'aliensoft_products_state'

const CATEGORIES_STORAGE_KEY = 'aliensoft_categories'

export const useProductsStore = defineStore('products', {
  state: () => {
    // Initialize from localStorage on app startup
    let savedProducts = []
    let savedCategories = []
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        savedProducts = JSON.parse(saved)
      }
      const savedCats = localStorage.getItem(CATEGORIES_STORAGE_KEY)
      if (savedCats) {
        savedCategories = JSON.parse(savedCats)
      }
    } catch (error) {
      console.error('Failed to restore from localStorage:', error)
    }
    
    return {
      products: savedProducts,
      currentProduct: null,
      categories: savedCategories,
      isLoading: false,
      error: null,
      currentRate: 129.60 // 1 USD = 129.60 KES
    }
  },
  
  getters: {
    // Total number of products
    totalProducts: (state) => state.products.length,
    
    // Total stock across all products
    totalStock: (state) => {
      return state.products.reduce((sum, product) => sum + (product.stock || 0), 0)
    },
    
    // Total inventory value in KES (formatted string)
    inventoryValueKES: (state) => {
      const total = state.products.reduce((sum, product) => {
        return sum + ((product.price || 0) * (product.stock || 0) * state.currentRate)
      }, 0)
      const valueFormatted = total.toFixed(2)
      const [wholePart, decimalPart] = valueFormatted.split('.')
      const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return 'KES ' + formattedWhole + '.' + decimalPart
    },
    
    // Low stock items (stock < 10) sorted ascending
    lowStockItems: (state) => {
      return state.products
        .filter(product => (product.stock || 0) < 10)
        .sort((a, b) => (a.stock || 0) - (b.stock || 0))
    },
    
    // Category distribution with counts and percentages
    categoryDistribution: (state) => {
      const categories = {}
      
      state.products.forEach(product => {
        const category = product.category || 'Other'
        categories[category] = (categories[category] || 0) + 1
      })
      
      const totalProducts = state.products.length || 1
      
      return Object.entries(categories)
        .map(([category, count]) => ({
          category,
          count,
          percent: Math.round((count / totalProducts) * 100)
        }))
        .sort((a, b) => b.count - a.count)
    },
    
    // Top products by stock
    topProductsByStock: (state) => (limit = 5) => {
      return [...state.products]
        .sort((a, b) => (b.stock || 0) - (a.stock || 0))
        .slice(0, limit)
    }
  },
  
  actions: {
    // Save products to localStorage
    saveToLocalStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.products))
      } catch (error) {
        console.error('Failed to save products to localStorage:', error)
      }
    },
    
    // Save categories to localStorage
    saveCategoriesToLocalStorage() {
      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(this.categories))
      } catch (error) {
        console.error('Failed to save categories to localStorage:', error)
      }
    },
    
    // Restore categories from localStorage
    restoreCategories() {
      try {
        const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY)
        if (saved) {
          this.categories = JSON.parse(saved)
          return
        }
      } catch (error) {
        console.error('Failed to restore categories from localStorage:', error)
      }
    },
    
    // Add a new category if it doesn't exist (stores in lowercase)
    addCategory(category) {
      const normalized = category.trim().toLowerCase()
      if (normalized && !this.categories.includes(normalized)) {
        this.categories.push(normalized)
        this.saveCategoriesToLocalStorage()
      }
    },
    
    // Initialize categories from products and deduplicate
    extractCategoriesFromProducts() {
      const newCategories = new Set(this.categories)
      this.products.forEach(product => {
        if (product.category) {
          const normalized = product.category.trim().toLowerCase()
          newCategories.add(normalized)
        }
      })
      this.categories = Array.from(newCategories).sort()
      this.saveCategoriesToLocalStorage()
    },
    
    // Restore products from localStorage or fetch from API
    async restoreFromLocalStorage() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          this.products = JSON.parse(saved)
        }
      } catch (error) {
        console.error('Failed to restore from localStorage:', error)
      }
      
      // Restore categories from localStorage
      this.restoreCategories()
      
      // If no products saved, fetch from API
      if (this.products.length === 0) {
        await this.fetchProducts()
      }
    },
    
    async fetchProducts() {
      this.isLoading = true
      this.error = null
      try {
        const data = await productsAPI.getAll()
        this.products = data.products
        
        // Extract and deduplicate all categories from products
        this.extractCategoriesFromProducts()
        
        this.saveToLocalStorage()
      } catch (error) {
        this.error = error.message || 'Failed to fetch products'
      } finally {
        this.isLoading = false
      }
    },
    
    async fetchProductById(id) {
      this.isLoading = true
      this.error = null
      try {
        const data = await productsAPI.getById(id)
        this.currentProduct = data
        return data
      } catch (error) {
        this.error = error.message || 'Failed to fetch product'
        return null
      } finally {
        this.isLoading = false
      }
    },
    
    async addProduct(product) {
      this.isLoading = true
      this.error = null
      try {
        // Generate a unique ID locally (since DummyJSON doesn't persist)
        const maxId = this.products.length > 0 
          ? Math.max(...this.products.map(p => p.id || 0)) 
          : 0
        const newId = maxId + 1
        
        // Create new product object with unique ID
        const newProduct = {
          id: newId,
          title: product.title,
          description: product.description,
          category: product.category.toLowerCase(),
          price: product.price,
          stock: product.stock,
          unit: product.unit || 'units',
          thumbnail: product.thumbnail || 'https://via.placeholder.com/150',
          rating: 0,
          reviews: []
        }
        
        // Add to beginning of array (newest first)
        this.products.unshift(newProduct)
        
        // Update current product to the newly created one
        this.currentProduct = { ...newProduct }
        
        // Add category if new
        this.addCategory(newProduct.category)
        
        // Save to localStorage immediately
        this.saveToLocalStorage()
        
        return { success: true, data: newProduct }
      } catch (error) {
        this.error = error.message || 'Failed to add product'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    async updateProduct(id, product) {
      this.isLoading = true
      this.error = null
      try {
        const numericId = Number(id)
        
        // Call API for compatibility (DummyJSON doesn't persist)
        await productsAPI.update(id, product)
        
        // Find the original product in store
        const index = this.products.findIndex(p => p.id === numericId)
        
        if (index !== -1) {
          // Merge original product with updated fields
          const updatedProduct = {
            ...this.products[index],
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: product.stock,
            unit: product.unit,
            thumbnail: product.thumbnail
          }
          
          // Update in products array - replace entire object to ensure reactivity
          this.products[index] = updatedProduct
          
          // Update current product if it matches
          if (this.currentProduct && this.currentProduct.id === numericId) {
            this.currentProduct = { ...updatedProduct }
          }
        }
        
        // Save to localStorage
        this.saveToLocalStorage()
        
        this.error = null
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Failed to update product'
        console.error('Update error:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    async deleteProduct(id) {
      this.isLoading = true
      this.error = null
      try {
        const numericId = Number(id)
        
        // Remove from products array locally
        this.products = this.products.filter(p => p.id !== numericId)
        
        // Clear current product if it matches
        if (this.currentProduct && this.currentProduct.id === numericId) {
          this.currentProduct = null
        }
        
        // Save updated products list to localStorage
        this.saveToLocalStorage()
        
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Failed to delete product'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    }
  }
})
