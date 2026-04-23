import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookList } from './BookList'
import { mockBooks } from '@/__mocks__/fixtures'

const noop = () => {}

describe('BookList', () => {
  it('renders skeleton cards while loading', () => {
    render(<BookList data={undefined} isLoading isError={false} onRetry={noop} />)
    expect(screen.getByRole('region', { name: /loading books/i })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('renders an error message when isError is true', () => {
    render(<BookList data={undefined} isLoading={false} isError onRetry={noop} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = jest.fn()
    render(<BookList data={undefined} isLoading={false} isError onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders an empty state when results are empty', () => {
    const emptyData = { ...mockBooks, results: [], count: 0 }
    render(<BookList data={emptyData} isLoading={false} isError={false} onRetry={noop} />)
    expect(screen.getByText(/no books found/i)).toBeInTheDocument()
  })

  it('renders the correct number of book cards', () => {
    render(<BookList data={mockBooks} isLoading={false} isError={false} onRetry={noop} />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('renders book titles', () => {
    render(<BookList data={mockBooks} isLoading={false} isError={false} onRetry={noop} />)
    expect(screen.getByText(/frankenstein/i)).toBeInTheDocument()
  })
})
