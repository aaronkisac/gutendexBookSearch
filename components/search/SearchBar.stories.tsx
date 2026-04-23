import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SearchBar } from './SearchBar'

const meta: Meta<typeof SearchBar> = {
  title: 'Search/SearchBar',
  component: SearchBar,
  parameters: { layout: 'padded' },
  args: { value: '', onChange: () => {} },
}
export default meta

export const Default: StoryObj<typeof SearchBar> = {}
