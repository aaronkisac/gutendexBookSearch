'use client'

import { LANGUAGES } from '@/lib/languages'

interface LanguageFilterProps {
  value: string
  onChange: (value: string) => void
}

export function LanguageFilter({ value, onChange }: LanguageFilterProps) {
  const selected = value ? value.split(',') : []
  const available = LANGUAGES.filter(({ code }) => !selected.includes(code))

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value
    if (!code || selected.includes(code)) return
    onChange([...selected, code].join(','))
  }

  return (
    <div>
      <label htmlFor="language-filter" className="block text-sm font-medium text-gray-700 mb-1">
        Language
      </label>
      <select
        id="language-filter"
        value=""
        onChange={handleSelect}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{selected.length === 0 ? 'All languages' : 'Add language…'}</option>
        {available.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
