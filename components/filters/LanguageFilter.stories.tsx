import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LanguageFilter } from './LanguageFilter'

const meta: Meta<typeof LanguageFilter> = {
  title: 'Filters/LanguageFilter',
  component: LanguageFilter,
  parameters: { layout: 'padded' },
  args: { onChange: () => {}, value: '' },
}
export default meta

export const Default: StoryObj<typeof LanguageFilter> = {}
