import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBooks } from './useBooks'
import { mockBooks } from '@/__mocks__/fixtures'

jest.mock('../lib/gutendex', () => ({
  fetchBooks: jest.fn(),
}))

import { fetchBooks } from '../lib/gutendex'
const mockFetchBooks = fetchBooks as jest.Mock

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

beforeEach(() => mockFetchBooks.mockReset())

describe('useBooks', () => {
  it('returns data on successful fetch', async () => {
    mockFetchBooks.mockResolvedValue(mockBooks)
    const { result } = renderHook(() => useBooks({}), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(2)
  })

  it('returns error state when fetchBooks throws', async () => {
    mockFetchBooks.mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useBooks({}), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('refetches when filters change', async () => {
    mockFetchBooks.mockResolvedValue(mockBooks)
    const { rerender } = renderHook(
      ({ filters }) => useBooks(filters),
      { wrapper: createWrapper(), initialProps: { filters: { search: 'foo' } } }
    )
    rerender({ filters: { search: 'bar' } })
    await waitFor(() => expect(mockFetchBooks).toHaveBeenCalledTimes(2))
  })
})
