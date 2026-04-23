const btnClass =
  'px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'

interface PaginationProps {
  currentPage: number
  hasNext: boolean
  hasPrevious: boolean
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, hasNext, hasPrevious, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        aria-label="Previous page"
        className={btnClass}
      >
        Previous
      </button>

      <span aria-current="page" className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        aria-label="Next page"
        className={btnClass}
      >
        Next
      </button>
    </nav>
  )
}
