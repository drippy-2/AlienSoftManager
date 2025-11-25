import axios from 'axios'

const BASE_URL = 'https://dummyjson.com'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  }
}

export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  
  create: async (product) => {
    const response = await api.post('/products/add', product)
    return response.data
  },
  
  update: async (id, product) => {
    const response = await api.put(`/products/${id}`, product)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  }
}

export default api
