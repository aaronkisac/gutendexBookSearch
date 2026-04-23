import Image from 'next/image'
import { getCoverUrl } from '@/lib/gutendex'
import { MAX_VISIBLE_SUBJECTS } from '@/lib/constants'
import type { GutendexBook } from '@/types/gutendex'

interface BookCardProps {
  book: GutendexBook
  priority?: boolean
}

export function BookCard({ book, priority = false }: BookCardProps) {
  const coverUrl = getCoverUrl(book)

  const authorNames =
    book.authors.length > 0
      ? book.authors.map((a) => a.name.replace(/^([^,]+),\s*(.+)$/, '$2 $1')).join(', ')
      : 'Unknown author'

  const visibleSubjects = book.subjects.slice(0, MAX_VISIBLE_SUBJECTS)
  const hiddenCount = book.subjects.length - MAX_VISIBLE_SUBJECTS

  return (
    <article className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            fill
            sizes="80px"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No cover
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <h2 className="font-semibold text-gray-900 leading-tight line-clamp-2">{book.title}</h2>
        <p className="text-sm text-gray-600">{authorNames}</p>

        {visibleSubjects.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {visibleSubjects.map((subject) => (
              <span
                key={subject}
                className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
              >
                {subject}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                +{hiddenCount} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
