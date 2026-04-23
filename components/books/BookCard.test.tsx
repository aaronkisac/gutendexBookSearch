import { render, screen } from '@testing-library/react'
import { BookCard } from './BookCard'
import type { GutendexBook } from '@/types/gutendex'

const baseBook: GutendexBook = {
  id: 84,
  title: 'Frankenstein',
  authors: [{ name: 'Shelley, Mary Wollstonecraft', birth_year: 1797, death_year: 1851 }],
  translators: [],
  subjects: ['Horror fiction', 'Science fiction', 'Gothic fiction', 'Epistolary fiction', 'Extra'],
  bookshelves: [],
  languages: ['en'],
  copyright: false,
  media_type: 'Text',
  formats: {
    'image/jpeg': 'https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg',
  },
  download_count: 90000,
}

describe('BookCard', () => {
  it('renders the book title', () => {
    render(<BookCard book={baseBook} />)
    expect(screen.getByRole('heading', { name: /frankenstein/i })).toBeInTheDocument()
  })

  it('renders formatted author name', () => {
    render(<BookCard book={baseBook} />)
    expect(screen.getByText(/shelley/i)).toBeInTheDocument()
  })

  it('renders "Unknown author" when authors array is empty', () => {
    render(<BookCard book={{ ...baseBook, authors: [] }} />)
    expect(screen.getByText('Unknown author')).toBeInTheDocument()
  })

  it('renders cover image when format is present', () => {
    render(<BookCard book={baseBook} />)
    expect(screen.getByAltText(/cover of frankenstein/i)).toBeInTheDocument()
  })

  it('renders placeholder when no cover image', () => {
    render(<BookCard book={{ ...baseBook, formats: {} }} />)
    expect(screen.getByText('No cover')).toBeInTheDocument()
  })

  it('shows at most 4 subjects and a "+N more" badge for the rest', () => {
    render(<BookCard book={baseBook} />)
    expect(screen.getByText('Horror fiction')).toBeInTheDocument()
    expect(screen.getByText('+1 more')).toBeInTheDocument()
    expect(screen.queryByText('Extra')).not.toBeInTheDocument()
  })
})
