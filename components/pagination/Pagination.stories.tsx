import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Pagination/Pagination',
  component: Pagination,
  parameters: { layout: 'padded' },
  args: { onPageChange: () => {} },
}
export default meta

type Story = StoryObj<typeof Pagination>

export const FirstPage: Story = {
  args: { currentPage: 1, hasNext: true, hasPrevious: false },
}

export const MiddlePage: Story = {
  args: { currentPage: 5, hasNext: true, hasPrevious: true },
}

export const LastPage: Story = {
  args: { currentPage: 10, hasNext: false, hasPrevious: true },
}
