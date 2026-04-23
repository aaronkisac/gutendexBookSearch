import { BookCardSkeleton } from '@/components/books/BookCardSkeleton'
import { SKELETON_ITEM_COUNT } from '@/lib/constants'

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse" role="status" aria-label="Loading page content">
      <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
      <div className="space-y-4 mb-6">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded w-40" />
          <div className="h-10 bg-gray-200 rounded w-40" />
        </div>
      </div>
      <ul className="space-y-3">
        {Array.from({ length: SKELETON_ITEM_COUNT }, (_, i) => (
          <li key={i}>
            <BookCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}
