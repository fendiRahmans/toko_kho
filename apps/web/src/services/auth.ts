import api from '../lib/api'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  // Add other fields if your API returns more data
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
  user: {
    id: number
    email: string
  }
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    return response.data
  },

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', userData)
    return response.data
  },

  // You can add more auth-related methods here
  // For example: logout, refresh token, get current user, etc.
}