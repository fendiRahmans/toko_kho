import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios'

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Change this to your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear token and redirect to login
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }

    // You can add more error handling here
    // For example, show toast notifications for different error types

    return Promise.reject(error)
  }
)

export default api