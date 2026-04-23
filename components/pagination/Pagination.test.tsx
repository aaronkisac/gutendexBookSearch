import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('disables Previous button on page 1', () => {
    render(
      <Pagination currentPage={1} hasNext hasPrevious={false} onPageChange={jest.fn()} />
    )
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled()
  })

  it('disables Next button when hasNext is false', () => {
    render(
      <Pagination currentPage={3} hasNext={false} hasPrevious onPageChange={jest.fn()} />
    )
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled()
  })

  it('calls onPageChange with page + 1 when Next is clicked', async () => {
    const onPageChange = jest.fn()
    render(
      <Pagination currentPage={2} hasNext hasPrevious onPageChange={onPageChange} />
    )
    await userEvent.click(screen.getByRole('button', { name: /next page/i }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with page - 1 when Previous is clicked', async () => {
    const onPageChange = jest.fn()
    render(
      <Pagination currentPage={3} hasNext hasPrevious onPageChange={onPageChange} />
    )
    await userEvent.click(screen.getByRole('button', { name: /previous page/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
