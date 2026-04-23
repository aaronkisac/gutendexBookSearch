import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CopyrightFilter } from './CopyrightFilter'

const meta: Meta<typeof CopyrightFilter> = {
  title: 'Filters/CopyrightFilter',
  component: CopyrightFilter,
  parameters: { layout: 'padded' },
  args: { onChange: () => {}, value: undefined },
}
export default meta

export const Default: StoryObj<typeof CopyrightFilter> = {}
