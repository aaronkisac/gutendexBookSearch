import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AuthorYearFilter } from './AuthorYearFilter'

const meta: Meta<typeof AuthorYearFilter> = {
  title: 'Filters/AuthorYearFilter',
  component: AuthorYearFilter,
  parameters: { layout: 'padded' },
  args: { startYear: undefined, endYear: undefined, onChange: () => {} },
}
export default meta

export const Default: StoryObj<typeof AuthorYearFilter> = {}
