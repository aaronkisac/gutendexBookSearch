// Matches BookCard dimensions exactly — prevents CLS when real cards replace skeleton
export function BookCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="h-28 w-20 flex-shrink-0 rounded bg-gray-200" />
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="mt-1 flex gap-1">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-5 bg-gray-200 rounded-full w-20" />
          <div className="h-5 bg-gray-200 rounded-full w-14" />
        </div>
      </div>
    </div>
  )
}
