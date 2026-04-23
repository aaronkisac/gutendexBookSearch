import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BookList } from './BookList'
import { mockBooks } from '@/__mocks__/fixtures'

const meta: Meta<typeof BookList> = {
  title: 'Books/BookList',
  component: BookList,
  parameters: { layout: 'padded' },
  args: { onRetry: () => {} },
}
export default meta

type Story = StoryObj<typeof BookList>

export const WithResults: Story = {
  args: { data: mockBooks, isLoading: false, isError: false },
}

export const Loading: Story = {
  args: { data: undefined, isLoading: true, isError: false },
}

export const Empty: Story = {
  args: {
    data: { count: 0, next: null, previous: null, results: [] },
    isLoading: false,
    isError: false,
    searchQuery: 'xyznotabook',
  },
}

export const Error: Story = {
  args: { data: undefined, isLoading: false, isError: true },
}
