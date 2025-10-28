import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { categoryService } from '../services/category'
import type { Category } from '../services/category'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'

// Zod schema for category validation
const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryService.findAll()
      setCategories(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError('Failed to load categories')
      toast.error(`Failed to load categories: ${errorMessage}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, data)
        toast.success('Category updated successfully!')
      } else {
        await categoryService.create(data)
        toast.success('Category created successfully!')
      }
      await loadCategories()
      setShowForm(false)
      setEditingCategory(null)
      form.reset()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      toast.error(`Failed to ${editingCategory ? 'update' : 'create'} category: ${errorMessage}`)
      console.error(err)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    form.reset({
      name: category.name,
      description: category.description || '',
    })
    setShowForm(true)
  }

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return

    setIsDeleting(true)
    try {
      await categoryService.remove(categoryToDelete.id)
      await loadCategories()
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      toast.success('Category deleted successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      toast.error(`Failed to delete category: ${errorMessage}`)
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCategory(null)
    form.reset()
  }

  const handleAddNew = () => {
    setEditingCategory(null)
    form.reset({
      name: '',
      description: '',
    })
    setShowForm(true)
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8 backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={handleAddNew} disabled={showForm}>
          Add Category
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Make changes to the category here.' : 'Add a new category to your store.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                className={form.formState.errors.description ? 'border-red-500' : ''}
                placeholder="Enter category description..."
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" className="text-black" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No categories found. Create your first category!
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || 'No description'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(category)}>
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
    </div>
  )
}

export default Categories