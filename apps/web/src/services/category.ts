import api from '../lib/api'

export interface Category {
  id: number
  name: string
  description?: string
  products: any[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
}

export interface CategoryQuery {
  page?: number
  limit?: number
  search?: string
}

export interface CategoryResponse {
  data: Category[]
  meta: {
    total: number
    page: string
    limit: string
    totalPages: number
  }
}

export const categoryService = {
  async findAll(query?: CategoryQuery): Promise<CategoryResponse> {
    const response = await api.get<CategoryResponse>('/categories', { params: query })
    return response.data
  },

  async findOne(id: number): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`)
    return response.data
  },

  async create(data: CreateCategoryRequest): Promise<Category> {
    const response = await api.post<Category>('/categories', data)
    return response.data
  },

  async update(id: number, data: UpdateCategoryRequest): Promise<Category> {
    const response = await api.patch<Category>(`/categories/${id}`, data)
    return response.data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}