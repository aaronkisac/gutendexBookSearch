import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InfoPopover } from './InfoPopover'

const meta: Meta<typeof InfoPopover> = {
  title: 'UI/InfoPopover',
  component: InfoPopover,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof InfoPopover>

export const Default: Story = {
  args: {
    label: 'Search help',
    children: (
      <p>
        Searches across <strong>titles</strong> and <strong>author names</strong>. Results include
        partial matches.
      </p>
    ),
  },
}
