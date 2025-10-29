import api from '../lib/api'

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  category: {
    id: number
    name: string
    description?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductRequest {
  name: string
  description?: string
  price: number
  categoryId: number
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  categoryId?: number
}

export interface ProductQuery {
  page?: number
  limit?: number
  search?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
}

export interface ProductResponse {
  data: Product[]
  meta: {
    total: number
    page: string
    limit: string
    totalPages: number
  }
}

export const productService = {
  async findAll(query?: ProductQuery): Promise<ProductResponse> {
    const response = await api.get<ProductResponse>('/products', { params: query })
    return response.data
  },

  async findOne(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  async create(data: CreateProductRequest): Promise<Product> {
    const response = await api.post<Product>('/products', data)
    return response.data
  },

  async update(id: number, data: UpdateProductRequest): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}`, data)
    return response.data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/products/${id}`)
  },
}