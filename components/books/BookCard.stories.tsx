import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BookCard } from './BookCard'

const meta: Meta<typeof BookCard> = {
  title: 'Books/BookCard',
  component: BookCard,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof BookCard>

const baseBook = {
  id: 84,
  title: 'Frankenstein; Or, The Modern Prometheus',
  authors: [{ name: 'Shelley, Mary Wollstonecraft', birth_year: 1797, death_year: 1851 }],
  translators: [],
  subjects: ['Horror fiction', 'Science fiction', 'Gothic fiction', 'Epistolary fiction'],
  bookshelves: [],
  languages: ['en'],
  copyright: false,
  media_type: 'Text',
  formats: {
    'image/jpeg': 'https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg',
  },
  download_count: 90000,
}

export const WithCover: Story = {
  args: { book: baseBook },
}

export const NoCover: Story = {
  args: { book: { ...baseBook, formats: {} } },
}

export const MultipleAuthors: Story = {
  args: {
    book: {
      ...baseBook,
      authors: [
        { name: 'Shelley, Mary Wollstonecraft', birth_year: 1797, death_year: 1851 },
        { name: 'Godwin, William', birth_year: 1756, death_year: 1836 },
      ],
    },
  },
}

export const NoSubjects: Story = {
  args: { book: { ...baseBook, subjects: [] } },
}

export const ManySubjects: Story = {
  args: {
    book: {
      ...baseBook,
      subjects: [
        'Horror fiction', 'Science fiction', 'Gothic fiction',
        'Epistolary fiction', 'Monsters -- Fiction', 'Scientists -- Fiction',
      ],
    },
  },
}
