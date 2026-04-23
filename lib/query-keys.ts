import type { BookFilters } from '@/types/gutendex'

export const bookKeys = {
  list: (filters: BookFilters) => ['books', 'list', filters] as const,
}
