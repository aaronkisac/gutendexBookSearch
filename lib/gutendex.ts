import type { BookFilters, GutendexBook, GutendexResponse } from '@/types/gutendex'

const BASE_URL = 'https://gutendex.com'

export class GutendexError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'GutendexError'
  }
}

export function getCoverUrl(book: GutendexBook): string | null {
  return book.formats['image/jpeg'] ?? null
}

export function buildSearchUrl(filters: BookFilters): string {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.languages) params.set('languages', filters.languages)
  if (filters.copyright) params.set('copyright', filters.copyright)
  if (filters.authorYearStart) params.set('author_year_start', String(filters.authorYearStart))
  if (filters.authorYearEnd) params.set('author_year_end', String(filters.authorYearEnd))
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  const qs = params.toString()
  return qs ? `${BASE_URL}/books?${qs}` : `${BASE_URL}/books`
}

export async function fetchBooks(filters: BookFilters): Promise<GutendexResponse> {
  const url = buildSearchUrl(filters)
  const res = await fetch(url)
  if (!res.ok) {
    throw new GutendexError(res.status, `Failed to fetch books: ${res.statusText}`)
  }
  return res.json() as Promise<GutendexResponse>
}
