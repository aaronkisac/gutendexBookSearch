import { LanguageFilter } from './LanguageFilter'
import { CopyrightFilter } from './CopyrightFilter'
import { AuthorYearFilter } from './AuthorYearFilter'
import type { BookFilters } from '@/types/gutendex'

interface FilterPanelProps {
  languages: string
  copyright: BookFilters['copyright'] | undefined
  authorYearStart: number | undefined
  authorYearEnd: number | undefined
  onLanguageChange: (value: string) => void
  onCopyrightChange: (value: BookFilters['copyright'] | undefined) => void
  onAuthorYearChange: (start: number | undefined, end: number | undefined) => void
}

export function FilterPanel({
  languages,
  copyright,
  authorYearStart,
  authorYearEnd,
  onLanguageChange,
  onCopyrightChange,
  onAuthorYearChange,
}: FilterPanelProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <LanguageFilter value={languages} onChange={onLanguageChange} />
      <CopyrightFilter value={copyright} onChange={onCopyrightChange} />
      <AuthorYearFilter
        startYear={authorYearStart}
        endYear={authorYearEnd}
        onChange={onAuthorYearChange}
      />
    </div>
  )
}
