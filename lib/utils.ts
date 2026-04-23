import type { BookFilters } from '@/types/gutendex'

export function pluralise(count: number, word: string): string {
  return `${count.toLocaleString('en-GB')} ${word}${count !== 1 ? 's' : ''}`
}

export function parseCopyrightParam(raw: string | null): BookFilters['copyright'] | undefined {
  if (raw === 'true' || raw === 'false') return raw
  return undefined
}

export function parseYearParam(raw: string | null): number | undefined {
  if (!raw) return undefined
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n !== 0 ? n : undefined
}
