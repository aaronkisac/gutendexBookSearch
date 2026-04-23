import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthorYearFilter } from './AuthorYearFilter'

function setup(props: Partial<React.ComponentProps<typeof AuthorYearFilter>> = {}) {
  const onChange = jest.fn()
  render(
    <AuthorYearFilter
      startYear={undefined}
      endYear={undefined}
      onChange={onChange}
      {...props}
    />
  )
  return { onChange }
}

describe('AuthorYearFilter', () => {
  it('renders two labelled inputs', () => {
    setup()
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument()
  })

  it('reflects controlled startYear and endYear values', () => {
    setup({ startYear: 1800, endYear: 1900 })
    expect(screen.getByLabelText(/from/i)).toHaveValue(1800)
    expect(screen.getByLabelText(/to/i)).toHaveValue(1900)
  })

  it('calls onChange with parsed years on blur', async () => {
    const { onChange } = setup()
    const fromInput = screen.getByLabelText(/from/i)
    await userEvent.type(fromInput, '1800')
    await userEvent.tab() 
    expect(onChange).toHaveBeenCalledWith(1800, undefined)
  })

  it('swaps inverted range silently', async () => {
    const { onChange } = setup()
    const fromInput = screen.getByLabelText(/from/i)
    const toInput = screen.getByLabelText(/to/i)
    await userEvent.type(fromInput, '1900')
    await userEvent.type(toInput, '1800')
    await userEvent.tab()
    expect(onChange).toHaveBeenCalledWith(1800, 1900)
  })

  it('passes undefined for empty inputs', async () => {
    const { onChange } = setup({ startYear: 1800, endYear: 1900 })
    const fromInput = screen.getByLabelText(/from/i)
    await userEvent.clear(fromInput)
    await userEvent.tab()
    expect(onChange).toHaveBeenCalledWith(undefined, 1900)
  })
})
