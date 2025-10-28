import React from 'react'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

/**
 * Reusable Pagination Component
 *
 * Usage Example:
 * ```tsx
 * const [currentPage, setCurrentPage] = useState(1)
 * const [itemsPerPage, setItemsPerPage] = useState(10)
 * const [totalItems, setTotalItems] = useState(0)
 * const [totalPages, setTotalPages] = useState(0)
 *
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   itemsPerPage={itemsPerPage}
 *   totalItems={totalItems}
 *   onPageChange={setCurrentPage}
 *   onItemsPerPageChange={(value) => {
 *     setItemsPerPage(Number(value))
 *     setCurrentPage(1)
 *   }}
 *   onPreviousPage={() => setCurrentPage(prev => Math.max(1, prev - 1))}
 *   onNextPage={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
 * />
 * ```
 */

interface PaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (value: string) => void
  onPreviousPage: () => void
  onNextPage: () => void
  itemsPerPageOptions?: number[]
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  onPreviousPage,
  onNextPage,
  itemsPerPageOptions = [5, 10, 20, 50],
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-600">
          Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of total {totalItems} entries
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              if (pageNumber > totalPages) return null

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default Pagination