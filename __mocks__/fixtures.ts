import type { GutendexResponse } from '@/types/gutendex'

export const mockBooks: GutendexResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 84,
      title: 'Frankenstein; Or, The Modern Prometheus',
      authors: [{ name: 'Shelley, Mary Wollstonecraft', birth_year: 1797, death_year: 1851 }],
      translators: [],
      subjects: ['Horror fiction', 'Science fiction'],
      bookshelves: [],
      languages: ['en'],
      copyright: false,
      media_type: 'Text',
      formats: {
        'image/jpeg': 'https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg',
        'text/html': 'https://www.gutenberg.org/files/84/84-h/84-h.htm',
      },
      download_count: 90000,
    },
    {
      id: 1342,
      title: 'Pride and Prejudice',
      authors: [{ name: 'Austen, Jane', birth_year: 1775, death_year: 1817 }],
      translators: [],
      subjects: ['Love stories', 'Domestic fiction'],
      bookshelves: [],
      languages: ['en'],
      copyright: false,
      media_type: 'Text',
      formats: {
        'image/jpeg': 'https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg',
      },
      download_count: 70000,
    },
  ],
}
