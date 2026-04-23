import { parseCopyrightParam, parseYearParam, pluralise } from './utils'

describe('pluralise', () => {
  it('returns singular for count 1', () => {
    expect(pluralise(1, 'result')).toBe('1 result')
  })
  it('returns plural for count 0', () => {
    expect(pluralise(0, 'result')).toBe('0 results')
  })
  it('returns plural for count > 1', () => {
    expect(pluralise(42, 'result')).toBe('42 results')
  })
})

describe('parseCopyrightParam', () => {
  it('returns "true" for "true"', () => {
    expect(parseCopyrightParam('true')).toBe('true')
  })
  it('returns "false" for "false"', () => {
    expect(parseCopyrightParam('false')).toBe('false')
  })
  it('returns undefined for null', () => {
    expect(parseCopyrightParam(null)).toBeUndefined()
  })
  it('returns undefined for empty string', () => {
    expect(parseCopyrightParam('')).toBeUndefined()
  })
  it('returns undefined for arbitrary string', () => {
    expect(parseCopyrightParam('yes')).toBeUndefined()
  })
})

describe('parseYearParam', () => {
  it('returns a valid positive integer', () => {
    expect(parseYearParam('1800')).toBe(1800)
  })
  it('returns undefined for null', () => {
    expect(parseYearParam(null)).toBeUndefined()
  })
  it('returns undefined for empty string', () => {
    expect(parseYearParam('')).toBeUndefined()
  })
  it('returns undefined for non-numeric string', () => {
    expect(parseYearParam('abc')).toBeUndefined()
  })
  it('returns undefined for zero', () => {
    expect(parseYearParam('0')).toBeUndefined()
  })
  it('returns a negative integer for BCE years', () => {
    expect(parseYearParam('-499')).toBe(-499)
  })
})
