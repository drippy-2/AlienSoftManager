import { defineStore } from 'pinia'
import { authAPI } from '../utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null
    }
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  
  actions: {
    async login(username, password) {
      try {
        const data = await authAPI.login(username, password)
        this.token = data.accessToken
        this.user = {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName
        }
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('user', JSON.stringify(this.user))
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Invalid credentials'
        }
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
