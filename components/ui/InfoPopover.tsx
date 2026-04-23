'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface InfoPopoverProps {
  label: string
  children: ReactNode
}

export function InfoPopover({ label, children }: InfoPopoverProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const left = Math.max(8, rect.right - 256)
    setCoords({ top: rect.bottom + 6, left })
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-xs font-bold hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        !
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={label}
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-[9999] w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-sm text-gray-700"
          >
            {children}
          </div>,
          document.body
        )}
    </>
  )
}
