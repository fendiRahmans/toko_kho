import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Textarea } from '../components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import { formatCurrency } from '../lib/utils'
import { categoryService, type Category } from '../services/category'
import { productService, type Product } from '../services/product'

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Product name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  price: z.number().min(0, 'Price must be greater than 0'),
  categoryId: z.number().min(1, 'Category is required'),
})

type ProductFormData = z.infer<typeof productSchema>

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string, categoryId?: number, minPriceFilter?: number, maxPriceFilter?: number) => {
      fetchProducts(1, searchTerm, categoryId, minPriceFilter, maxPriceFilter)
    }, 500),
    []
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    const categoryId = selectedCategory && selectedCategory !== 'all' ? parseInt(selectedCategory) : undefined
    const minPriceNum = minPrice ? parseFloat(minPrice) : undefined
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined
    debouncedSearch(value, categoryId, minPriceNum, maxPriceNum)
  }

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: 0
    },
  })

  const fetchProducts = async (page = 1, searchTerm = '', categoryId?: number, minPriceFilter?: number, maxPriceFilter?: number) => {
    try {
      setLoading(true)
      const query = {
        page,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        categoryId: categoryId || undefined,
        minPrice: minPriceFilter || undefined,
        maxPrice: maxPriceFilter || undefined
      }
      const response = await productService.findAll(query)
      setProducts(response.data)
      setTotalPages(response.meta.totalPages)
      setTotalItems(response.meta.total)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryService.findAll({ limit: 100 })
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Effect untuk handle perubahan filter dan items per page
  useEffect(() => {
    const categoryId = selectedCategory && selectedCategory !== 'all' ? parseInt(selectedCategory) : undefined
    const minPriceNum = minPrice ? parseFloat(minPrice) : undefined
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined
    fetchProducts(1, search, categoryId, minPriceNum, maxPriceNum)
  }, [selectedCategory, minPrice, maxPrice, itemsPerPage])

  const handlePageChange = (page: number) => {
    const categoryId = selectedCategory && selectedCategory !== 'all' ? parseInt(selectedCategory) : undefined
    const minPriceNum = minPrice ? parseFloat(minPrice) : undefined
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined
    fetchProducts(page, search, categoryId, minPriceNum, maxPriceNum)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, data)
        toast.success('Product updated successfully!')
      } else {
        await productService.create(data)
        toast.success('Product created successfully!')
      }
      setIsCreateDialogOpen(false)
      setEditingProduct(null)
      form.reset()
      setPriceInput('')
      fetchProducts(currentPage, search, selectedCategory && selectedCategory !== 'all' ? parseInt(selectedCategory) : undefined, minPrice ? parseFloat(minPrice) : undefined, maxPrice ? parseFloat(maxPrice) : undefined)
    } catch (error) {
      console.error(`Error ${editingProduct ? 'updating' : 'creating'} product:`, error)
      toast.error(`Failed to ${editingProduct ? 'update' : 'create'} product`)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    form.reset({
      name: product.name,
      description: product.description || '',
      price: product.price,
      categoryId: product.category.id
    })
    setPriceInput(`Rp ${new Intl.NumberFormat('id-ID').format(product.price)}`)
    setIsCreateDialogOpen(true)
  }

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    setIsDeleting(true)
    try {
      await productService.remove(productToDelete.id)
      await fetchProducts(currentPage, search, selectedCategory && selectedCategory !== 'all' ? parseInt(selectedCategory) : undefined, minPrice ? parseFloat(minPrice) : undefined, maxPrice ? parseFloat(maxPrice) : undefined)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
      toast.success('Product deleted successfully!')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  const resetForm = () => {
    setIsCreateDialogOpen(false)
    setEditingProduct(null)
    form.reset()
    setPriceInput('')
  }

  const handleDialogChange = (open: boolean) => {
    setIsCreateDialogOpen(open)
    if (!open) {
      form.reset()
      setPriceInput('')
      setEditingProduct(null) // Reset editing state when dialog closes
    }
  }

  const [priceInput, setPriceInput] = useState('')

  const handlePriceChange = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '')

    // Update display input
    setPriceInput(numericValue ? `Rp ${new Intl.NumberFormat('id-ID').format(parseInt(numericValue))}` : '')

    // Update form value
    const parsedValue = parseInt(numericValue) || 0
    form.setValue('price', parsedValue)
  }

  return (
    <div className="container mx-auto px-4 py-8 backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600">Explore our complete product collection.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Make changes to the product here.' : 'Add a new product to your store.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  className={form.formState.errors.name ? 'border-red-500' : ''}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.watch('categoryId')?.toString() || ''}
                  onValueChange={(value: string) => form.setValue('categoryId', parseInt(value))}
                >
                  <SelectTrigger className={form.formState.errors.categoryId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.categoryId.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="text"
                  value={priceInput}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className={form.formState.errors.price ? 'border-red-500' : ''}
                  placeholder="Rp 0"
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.price.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  className={form.formState.errors.description ? 'border-red-500' : ''}
                  placeholder="Enter product description"
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {editingProduct ? 'Update Product' : 'Save Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative max-w-sm">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pr-8"
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        <Select value={selectedCategory || 'all'} onValueChange={setSelectedCategory}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="max-w-xs"
        />
        <Input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No products found. Create your first product!
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {product.description ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block truncate cursor-help">
                                {product.description}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs break-words">{product.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(product)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </div>
      )}
    </div>
  )
}

export default Products