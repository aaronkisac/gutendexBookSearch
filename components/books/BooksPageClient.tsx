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
      if (!('page' in updates)) params.delete('page')
      const qs = params.toString()
      router.push(`${pathname}${qs ? `?${qs}` : ''}`)
    },
    [searchParams, router, pathname]
  )

  const handleSearch = useCallback(
    (value: string) => {
      if (value) addRecentSearch(value)
      updateParams({ search: value })
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
      updateParams({ languages: next })
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
          onLanguageChange={(v) => updateParams({ languages: v })}
          onCopyrightChange={(v) => updateParams({ copyright: v })}
          onAuthorYearChange={(start, end) => updateParams({ authorYearStart: start, authorYearEnd: end })}
        />
      </div>

      {data && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <p className="text-sm text-gray-600 shrink-0">{pluralise(data.count, 'result')}</p>
          <ActiveFilters
            filters={filters}
            onRemoveLanguage={handleRemoveLanguage}
            onRemoveCopyright={() => updateParams({ copyright: undefined })}
            onRemoveAuthorYear={() => updateParams({ authorYearStart: undefined, authorYearEnd: undefined })}
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

      {data && (data.next || data.previous) && (
        <Pagination
          currentPage={currentPage}
          hasNext={!!data.next}
          hasPrevious={!!data.previous}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
