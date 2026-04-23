import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FilterPanel } from './FilterPanel'

const meta: Meta<typeof FilterPanel> = {
  title: 'Filters/FilterPanel',
  component: FilterPanel,
  parameters: { layout: 'padded' },
  args: {
    languages: '',
    copyright: undefined,
    authorYearStart: undefined,
    authorYearEnd: undefined,
    onLanguageChange: () => {},
    onCopyrightChange: () => {},
    onAuthorYearChange: () => {},
  },
}
export default meta

export const Default: StoryObj<typeof FilterPanel> = {}
