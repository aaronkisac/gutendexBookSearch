import { useQuery } from '@tanstack/react-query'
import { fetchBooks } from '@/lib/gutendex'
import { bookKeys } from '@/lib/query-keys'
import { QUERY_STALE_TIME_DEFAULT } from '@/lib/constants'
import type { BookFilters } from '@/types/gutendex'

export function useBooks(filters: BookFilters) {
  return useQuery({
    queryKey: bookKeys.list(filters),
    queryFn: () => fetchBooks(filters),
    placeholderData: (previousData) => previousData,
    staleTime: QUERY_STALE_TIME_DEFAULT,
  })
}
