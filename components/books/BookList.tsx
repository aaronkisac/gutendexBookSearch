import { BookCard } from './BookCard'
import { BookCardSkeleton } from './BookCardSkeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import { SKELETON_ITEM_COUNT, PRIORITY_IMAGE_THRESHOLD } from '@/lib/constants'
import type { GutendexResponse } from '@/types/gutendex'

interface BookListProps {
  data: GutendexResponse | undefined
  isLoading: boolean
  isError: boolean
  searchQuery?: string
  onRetry: () => void
}

export function BookList({ data, isLoading, isError, searchQuery, onRetry }: BookListProps) {
  if (isLoading) {
    return (
      <section aria-label="Loading books" aria-busy="true">
        <ul className="space-y-3">
          {Array.from({ length: SKELETON_ITEM_COUNT }, (_, i) => (
            <li key={i}>
              <BookCardSkeleton />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (isError) {
    return <ErrorMessage onRetry={onRetry} />
  }

  if (!data || data.results.length === 0) {
    return <EmptyState query={searchQuery} />
  }

  return (
    <section aria-label="Book results">
      <ul className="space-y-3">
        {data.results.map((book, index) => (
          <li key={book.id}>
            <BookCard book={book} priority={index < PRIORITY_IMAGE_THRESHOLD} />
          </li>
        ))}
      </ul>
    </section>
  )
}
