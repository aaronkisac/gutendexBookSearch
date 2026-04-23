'use client'

import { useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { BookList } from '@/components/books/BookList'
import { Pagination } from '@/components/pagination/Pagination'
import { useBooks } from '@/hooks/useBooks'
import { useAppStore } from '@/store/useAppStore'
import { ActiveFilters } from '@/components/filters/ActiveFilters'
import { pluralise, parseCopyrightParam, parseYearParam } from '@/lib/utils'
import { GUTENDEX_PAGE_SIZE } from '@/lib/constants'
import type { BookFilters } from '@/types/gutendex'

export function BooksPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const addRecentSearch = useAppStore((s) => s.addRecentSearch)

  const filters: BookFilters = {
    search: searchParams.get('search') ?? undefined,
    languages: searchParams.get('languages') ?? undefined,
    copyright: parseCopyrightParam(searchParams.get('copyright')),
    authorYearStart: parseYearParam(searchParams.get('authorYearStart')),
    authorYearEnd: parseYearParam(searchParams.get('authorYearEnd')),
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
  }

  const { data, isLoading, isError, refetch } = useBooks(filters)
  const currentPage = filters.page ?? 1
  const totalPages = data ? Math.ceil(data.count / GUTENDEX_PAGE_SIZE) : 1

  const updateParams = useCallback(
    (updates: Partial<Record<string, string | number | undefined>>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })
      const qs = params.toString()
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`)
    },
    [searchParams, router, pathname]
  )

  const handleSearch = useCallback(
    (value: string) => {
      if (value) addRecentSearch(value)
      updateParams({ search: value, page: undefined })
    },
    [updateParams, addRecentSearch]
  )

  const handlePageChange = useCallback(
    (page: number) => updateParams({ page: page <= 1 ? undefined : page }),
    [updateParams]
  )

  const handleRemoveLanguage = useCallback(
    (code: string) => {
      const next = (filters.languages ?? '').split(',').filter((c) => c !== code).join(',')
      updateParams({ languages: next, page: undefined })
    },
    [filters.languages, updateParams]
  )

  let resultAnnouncement = ''
  if (isLoading) resultAnnouncement = 'Loading results…'
  else if (isError) resultAnnouncement = 'Failed to load results.'
  else if (data) resultAnnouncement = `${pluralise(data.count, 'result')} found.`

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Book Search</h1>

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {resultAnnouncement}
      </div>

      <div className="space-y-4 mb-8">
        <SearchBar value={filters.search ?? ''} onChange={handleSearch} />
        <FilterPanel
          languages={filters.languages ?? ''}
          copyright={filters.copyright}
          authorYearStart={filters.authorYearStart}
          authorYearEnd={filters.authorYearEnd}
          onLanguageChange={(v) => updateParams({ languages: v, page: undefined })}
          onCopyrightChange={(v) => updateParams({ copyright: v, page: undefined })}
          onAuthorYearChange={(start, end) => updateParams({ authorYearStart: start, authorYearEnd: end, page: undefined })}
        />
      </div>

      {data && (
        <div className="mb-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-gray-600 shrink-0">{pluralise(data.count, 'result')}</p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!data.previous}
                  aria-label="Previous page"
                  className="px-2 py-0.5 rounded border border-gray-300 text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  ‹
                </button>
                <span className="text-gray-500 tabular-nums">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!data.next}
                  aria-label="Next page"
                  className="px-2 py-0.5 rounded border border-gray-300 text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  ›
                </button>
              </div>
            )}
          </div>
          <ActiveFilters
            filters={filters}
            onRemoveLanguage={handleRemoveLanguage}
            onRemoveCopyright={() => updateParams({ copyright: undefined, page: undefined })}
            onRemoveAuthorYear={() => updateParams({ authorYearStart: undefined, authorYearEnd: undefined, page: undefined })}
          />
        </div>
      )}

      <BookList
        data={data}
        isLoading={isLoading}
        isError={isError}
        searchQuery={filters.search}
        onRetry={() => refetch()}
      />

      {data && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          hasNext={!!data.next}
          hasPrevious={!!data.previous}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
