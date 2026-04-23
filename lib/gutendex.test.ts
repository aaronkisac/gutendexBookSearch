import { buildSearchUrl, fetchBooks, GutendexError } from './gutendex'
import { mockBooks } from '@/__mocks__/fixtures'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => mockFetch.mockReset())

describe('buildSearchUrl', () => {
  it('returns base URL with no query string when filters are empty', () => {
    expect(buildSearchUrl({})).toBe('https://gutendex.com/books')
  })

  it('includes search param', () => {
    expect(buildSearchUrl({ search: 'frankenstein' })).toContain('search=frankenstein')
  })

  it('includes languages param', () => {
    const url = buildSearchUrl({ languages: 'en,fr' })
    expect(decodeURIComponent(url)).toContain('languages=en,fr')
  })

  it('includes copyright param', () => {
    expect(buildSearchUrl({ copyright: 'false' })).toContain('copyright=false')
  })

  it('includes author_year_start param', () => {
    expect(buildSearchUrl({ authorYearStart: 1800 })).toContain('author_year_start=1800')
  })

  it('includes author_year_end param', () => {
    expect(buildSearchUrl({ authorYearEnd: 1900 })).toContain('author_year_end=1900')
  })

  it('includes both author year params together', () => {
    const url = buildSearchUrl({ authorYearStart: 1800, authorYearEnd: 1900 })
    expect(url).toContain('author_year_start=1800')
    expect(url).toContain('author_year_end=1900')
  })

  it('omits page param when page is 1', () => {
    expect(buildSearchUrl({ page: 1 })).not.toContain('page=')
  })

  it('includes page param when page > 1', () => {
    expect(buildSearchUrl({ page: 3 })).toContain('page=3')
  })
})

describe('fetchBooks', () => {
  it('returns GutendexResponse on success', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockBooks) })
    const result = await fetchBooks({})
    expect(result.results).toHaveLength(2)
    expect(result.count).toBe(2)
  })

  it('throws GutendexError on non-200 response', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' })
    await expect(fetchBooks({})).rejects.toThrow(GutendexError)
  })

  it('GutendexError carries the HTTP status code', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' })
    const error = await fetchBooks({}).catch((e) => e)
    expect(error).toBeInstanceOf(GutendexError)
    expect((error as GutendexError).status).toBe(404)
  })
})
