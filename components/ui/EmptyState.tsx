export function EmptyState({ query }: { query?: string }) {
  return (
    <div role="status" className="text-center py-16 text-gray-600">
      <p className="text-lg font-medium">No books found</p>
      {query && (
        <p className="text-sm mt-1">
          No results for &ldquo;<span className="font-medium">{query}</span>&rdquo;. Try a different
          search or adjust your filters.
        </p>
      )}
    </div>
  )
}
