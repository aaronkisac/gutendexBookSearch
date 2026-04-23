'use client'

import { parseCopyrightParam } from '@/lib/utils'
import type { BookFilters } from '@/types/gutendex'

interface CopyrightFilterProps {
  value: BookFilters['copyright'] | undefined
  onChange: (value: BookFilters['copyright'] | undefined) => void
}

export function CopyrightFilter({ value, onChange }: CopyrightFilterProps) {
  function handleChange(raw: string) {
    onChange(parseCopyrightParam(raw))
  }

  return (
    <div>
      <label htmlFor="copyright-filter" className="block text-sm font-medium text-gray-700 mb-1">
        Copyright
      </label>
      <select
        id="copyright-filter"
        value={value ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All</option>
        <option value="false">Public domain</option>
        <option value="true">Copyrighted</option>
      </select>
    </div>
  )
}
