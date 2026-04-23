'use client'

import { useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { InfoPopover } from '@/components/ui/InfoPopover'
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search by title or author…',
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)
  const debouncedValue = useDebounce(inputValue, SEARCH_DEBOUNCE_MS)
  const isFirstRender = useRef(true)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onChangeRef.current(debouncedValue)
  }, [debouncedValue])

  return (
    <div className="relative">
      <label htmlFor="book-search" className="sr-only">
        Search books
      </label>
      <input
        id="book-search"
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <InfoPopover label="Search help">
          <p className="mb-2">
            Searches across <strong>titles</strong> and <strong>author names</strong>. Results
            include partial matches.
          </p>
          <p className="text-gray-500">
            e.g. <code className="bg-gray-100 px-1 rounded">dickens</code> returns books by Charles
            Dickens, <code className="bg-gray-100 px-1 rounded">great expectations</code> returns
            that title directly.
          </p>
        </InfoPopover>
      </div>
    </div>
  )
}
