'use client'

import { useState, useEffect } from 'react'
import { InfoPopover } from '@/components/ui/InfoPopover'
import { MAX_AUTHOR_YEAR } from '@/lib/constants'

interface AuthorYearFilterProps {
  startYear: number | undefined
  endYear: number | undefined
  onChange: (start: number | undefined, end: number | undefined) => void
}

export function AuthorYearFilter({ startYear, endYear, onChange }: AuthorYearFilterProps) {
  const [start, setStart] = useState(startYear?.toString() ?? '')
  const [end, setEnd] = useState(endYear?.toString() ?? '')

  useEffect(() => { setStart(startYear?.toString() ?? '') }, [startYear])
  useEffect(() => { setEnd(endYear?.toString() ?? '') }, [endYear])

  function commit() {
    const s = start ? parseInt(start, 10) : undefined
    const e = end ? parseInt(end, 10) : undefined

    const validStart = s !== undefined && s !== 0 ? s : undefined
    const validEnd = e !== undefined && e !== 0 ? e : undefined

    if (validStart && validEnd && validStart > validEnd) {
      onChange(validEnd, validStart)
      return
    }
    onChange(validStart, validEnd)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commit()
  }

  return (
    <fieldset>
      <div className="flex items-center gap-1 mb-1">
        <legend className="text-sm font-medium text-gray-700">Author birth year</legend>
        <InfoPopover label="Author birth year help">
          <p className="mb-2">
            Finds books where at least one author was <strong>alive at any point</strong> within the
            given range. Use negative numbers for BCE.
          </p>
          <p className="text-gray-500">
            e.g. <code className="bg-gray-100 px-1 rounded">-499</code> to{' '}
            <code className="bg-gray-100 px-1 rounded">-400</code> = authors alive in the 5th
            century BCE, <code className="bg-gray-100 px-1 rounded">1800</code> to{' '}
            <code className="bg-gray-100 px-1 rounded">1899</code> = 19th century CE.
          </p>
        </InfoPopover>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="year-start" className="sr-only">From year</label>
        <input
          id="year-start"
          type="number"
          placeholder="From"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          max={MAX_AUTHOR_YEAR}
          className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Author birth year from"
        />
        <span className="text-sm text-gray-500" aria-hidden="true">–</span>
        <label htmlFor="year-end" className="sr-only">To year</label>
        <input
          id="year-end"
          type="number"
          placeholder="To"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          max={MAX_AUTHOR_YEAR}
          className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Author birth year to"
        />
      </div>
    </fieldset>
  )
}
