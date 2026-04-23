import { http, HttpResponse } from 'msw'
import { mockBooks } from './fixtures'

export const handlers = [
  http.get('https://gutendex.com/books', () => {
    return HttpResponse.json(mockBooks)
  }),
]
