import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

jest.useFakeTimers()

describe('SearchBar', () => {
  it('renders the input with the given value', () => {
    render(<SearchBar value="tolkien" onChange={jest.fn()} />)
    expect(screen.getByRole('searchbox')).toHaveValue('tolkien')
  })

  it('does not call onChange during the debounce window', async () => {
    const onChange = jest.fn()
    render(<SearchBar value="" onChange={onChange} />)
    await userEvent.type(screen.getByRole('searchbox'), 'a', { delay: null })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('calls onChange with debounced value after 300 ms', async () => {
    const onChange = jest.fn()
    render(<SearchBar value="" onChange={onChange} />)
    await userEvent.type(screen.getByRole('searchbox'), 'moby', { delay: null })
    act(() => jest.advanceTimersByTime(300))
    expect(onChange).toHaveBeenCalledWith('moby')
  })
})
