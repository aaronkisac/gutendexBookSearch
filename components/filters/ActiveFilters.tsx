'use client'

import { LANGUAGES } from '@/lib/languages'
import type { BookFilters } from '@/types/gutendex'

interface ActiveFiltersProps {
  filters: BookFilters
  onRemoveLanguage: (code: string) => void
  onRemoveCopyright: () => void
  onRemoveAuthorYear: () => void
}

interface ChipProps {
  label: string
  onRemove: () => void
}

function Chip({ label, onRemove }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
      {label}
      <button
        type="button"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
        className="hover:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-full leading-none"
      >
        ×
      </button>
    </span>
  )
}

export function ActiveFilters({
  filters,
  onRemoveLanguage,
  onRemoveCopyright,
  onRemoveAuthorYear,
}: ActiveFiltersProps) {
  const languages = filters.languages ? filters.languages.split(',') : []
  const hasCopyright = !!filters.copyright
  const hasAuthorYear = filters.authorYearStart !== undefined || filters.authorYearEnd !== undefined

  if (!languages.length && !hasCopyright && !hasAuthorYear) return null

  const copyrightLabel = filters.copyright === 'true' ? 'Copyrighted' : 'Public domain'

  const yearLabel = [
    filters.authorYearStart !== undefined ? String(filters.authorYearStart) : '…',
    filters.authorYearEnd !== undefined ? String(filters.authorYearEnd) : '…',
  ].join(' – ')

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {languages.map((code) => {
        const label = LANGUAGES.find((l) => l.code === code)?.label ?? code
        return <Chip key={code} label={label} onRemove={() => onRemoveLanguage(code)} />
      })}
      {hasCopyright && <Chip label={copyrightLabel} onRemove={onRemoveCopyright} />}
      {hasAuthorYear && <Chip label={yearLabel} onRemove={onRemoveAuthorYear} />}
    </div>
  )
}
