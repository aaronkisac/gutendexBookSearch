import { Suspense } from 'react'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { BooksPageClient } from '@/components/books/BooksPageClient'
import { fetchBooks } from '@/lib/gutendex'
import { bookKeys } from '@/lib/query-keys'
import { parseCopyrightParam, parseYearParam } from '@/lib/utils'
import { QUERY_STALE_TIME_SHORT, SERVER_PREFETCH_TIMEOUT_MS } from '@/lib/constants'
import Loading from './loading'
import type { BookFilters } from '@/types/gutendex'

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams

  const filters: BookFilters = {
    search: params.search ?? undefined,
    languages: params.languages ?? undefined,
    copyright: parseCopyrightParam(params.copyright ?? null),
    authorYearStart: parseYearParam(params.authorYearStart ?? null),
    authorYearEnd: parseYearParam(params.authorYearEnd ?? null),
    page: params.page ? Number(params.page) : undefined,
  }

  const queryClient = new QueryClient()

  await Promise.race([
    queryClient.prefetchQuery({
      queryKey: bookKeys.list(filters),
      queryFn: () => fetchBooks(filters),
      staleTime: QUERY_STALE_TIME_SHORT,
    }),
    new Promise<void>((resolve) => setTimeout(resolve, SERVER_PREFETCH_TIMEOUT_MS)),
  ])

  return (
    <main id="main-content">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loading />}>
          <BooksPageClient />
        </Suspense>
      </HydrationBoundary>
    </main>
  )
}
