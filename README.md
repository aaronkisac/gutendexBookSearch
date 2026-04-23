# Gutendex Book Search

A book search application built on top of the [Gutendex API](https://gutendex.com/), which provides Project Gutenberg ebook metadata. Built as a take-home technical test.

**Live app:** https://gutendex-search-book.vercel.app  
**Storybook:** https://aaronkisac.github.io/gutendexBookSearch

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests
npm run type-check # TypeScript validation
```

---

## Features

- **Search** by title and author (debounced, 300 ms)
- **Language filter** — dropdown of common ISO 639-1 languages
- **Copyright filter** — all / public domain / copyrighted
- **Author birth year range** — filter books by when authors were alive
- **Paginated results** — URL-driven, survives refresh and sharing
- **Compact top pagination** — page indicator with prev/next at the top of results
- **Loading / error / empty states** across all async transitions
- **Persistent state** — recent searches stored in localStorage via Zustand

---

## Architecture & Design Decisions

### URL as the source of truth for filter state

All search query, language, copyright, author year range, and page values live in the URL (`?search=&languages=&copyright=&authorYearStart=&authorYearEnd=&page=`). Results are shareable and bookmark-able out of the box, and there is no synchronisation problem between UI state and the address bar.

This means no global store is needed for filter state — I intentionally chose not to use Zustand or React Context for this. The URL is a better fit. Zustand is used only where localStorage persistence is genuinely needed (recent searches), which keeps it scoped to its actual purpose.

Filter changes always reset the page to 1 explicitly at the call site. This is more legible than a single `updateParams` side-effect doing it implicitly — every caller owns its intent.

### Next.js App Router

The App Router gives a clean split between the server shell (`app/books/page.tsx`) and the interactive client component (`BooksPageClient`). The server component prefetches the initial book query and dehydrates it into the HTML via `HydrationBoundary`, so the client receives data immediately on hydration without an extra API round-trip.

A 3-second `Promise.race` timeout guards the server prefetch — if Gutendex is slow, Next.js streams the Suspense skeleton rather than blocking the response.

### TanStack Query v5

Used for all API data fetching. The query key is `['books', 'list', filters]` — when any filter changes, the URL updates, `useSearchParams()` re-reads it, and TanStack Query fires a new request automatically. `placeholderData` keeps the previous page visible while the next loads, avoiding a flash of empty state on pagination. `staleTime: 5 min` means repeat visits to the same filter combination are instant.

### Three-layer state architecture

| Layer | Tool | What lives here |
|-------|------|-----------------|
| URL state | `useSearchParams` + `useRouter` | Search query, filters, page number |
| Server state | TanStack Query | Gutendex API responses — caching, loading, error |
| Global UI state | Zustand + `persist` | Recent searches (last 5) |

### Constants

All magic numbers live in `lib/constants.ts` — page size, debounce delay, query timings, UI limits. This makes the values easy to find and adjust without hunting through component files.

### Core Web Vitals

Measured against the live Vercel deployment using Lighthouse headless (no throttling):

| Metric | Production (Vercel) | Target |
|---|---|---|
| **FCP** | 1.0 s ✅ | < 1.8 s |
| **LCP** | 2.2 s ✅ | < 2.5 s |
| **TBT** | 280 ms 🟡 | < 200 ms |
| **CLS** | 0 ✅ | < 0.1 |
| **Score** | 91 | — |

**CWV optimisations in place:**
- Server-side prefetch via `HydrationBoundary` eliminates the client-side data waterfall
- Cover images are **not** preloaded with `priority` — this makes the LCP element the page `<h1>` (available instantly from SSR) rather than a slow image from gutenberg.org. An earlier version used `priority` on the first 3 covers and LCP was 37.6 s as a result.
- `minimumCacheTTL: 7 days` on `/_next/image` — once Vercel optimises a cover it stays cached for 7 days
- `imageSizes: [80, 160, 240]` shrinks the `srcset` from 17 variants to 3 for 80 px thumbnails
- `preconnect` to gutendex.com and gutenberg.org warms DNS/TLS before the first query

---

## Testing

```bash
npm test                  # unit tests
npm run test:coverage     # with coverage report
npm run test:e2e          # Playwright E2E (requires built app: npm run build first)
```

### Unit test approach

Tests use Jest and React Testing Library, testing behaviour rather than implementation:

| File | What it covers |
|------|----------------|
| `lib/gutendex.test.ts` | URL construction, fetch error handling |
| `hooks/useBooks.test.ts` | TanStack Query hook states (success, error, refetch) |
| `components/books/BookCard.test.tsx` | Rendering variants (no author, no cover, truncated subjects) |
| `components/books/BookList.test.tsx` | Loading / error / empty / results states |
| `components/search/SearchBar.test.tsx` | Debounce timing |
| `components/filters/AuthorYearFilter.test.tsx` | Year input validation, swap logic, keyboard commit |
| `components/pagination/Pagination.test.tsx` | Button disabled states, page change callbacks |
| `lib/utils.test.ts` | Utility functions |

### MSW — a note on Jest compatibility

MSW v2.7's `rettime` dependency ships as pure ESM, which conflicts with Jest's CommonJS module system. Rather than introduce a complex experimental VM modules setup, I made the pragmatic decision to mock `fetch` directly with `jest.fn()` in unit tests, and keep MSW for Playwright E2E tests where the full browser environment supports it natively. This is documented here so reviewers know it was a deliberate choice.

### Intentionally not tested

- `FilterPanel` — individual filters are tested at the unit level; their integration is covered by E2E
- `BooksPageClient` — URL state wiring is best validated in a real browser; covered by Playwright
- CSS/visual correctness — out of scope for unit tests; Playwright with visual regression would be the right tool

### E2E tests (Playwright)

`e2e/book-search.spec.ts` covers three scenarios against a production build:

1. **Happy path** — search, filter, verify results appear
2. **Empty state** — search term with no results shows the empty state message
3. **Error state** — API unavailable, error message and retry button appear

**A note on the error-state test:** The naive approach of intercepting requests at the browser level doesn't work with SSR + `HydrationBoundary` — every `router.replace()` re-runs the server component, which fetches server-to-server. The fix: install Playwright's fake clock 70 seconds ahead before `page.goto()`. The server prefetch uses `QUERY_STALE_TIME_SHORT` (60 s), so the hydrated cache entry is immediately stale on the client. TanStack Query fires `refetchOnMount` as a pure client-side fetch — no URL change, no RSC navigation — which the route intercept can abort. After `retry: 1` exhausts, the error state renders.

---

## CI

GitHub Actions runs on every push and pull request to `main`:

- **quality** — lint → type-check → unit tests with coverage
- **e2e** (needs: quality) — build → Playwright chromium tests
- **storybook** — build and deploy to GitHub Pages on pushes to `main`

Vercel handles production deployment automatically via the GitHub integration.

---

## What I would add next

- **Book detail page** (`/books/[id]`) — full description, download links, related books
- **Topic/subject filter** — the Gutendex API supports a `topic=` query param that isn't exposed yet
- **Lighthouse CI** — automated Core Web Vitals budget enforced in the pipeline
- **Playwright visual regression** — screenshot diffing for UI components
- **Infinite scroll** — as an alternative pagination mode for mobile

---

## Folder structure

```
├── app/
│   ├── layout.tsx              # Root layout — QueryProvider, Inter font, global CSS
│   ├── page.tsx                # / → redirect to /books
│   └── books/
│       ├── page.tsx            # Server component shell + HydrationBoundary
│       └── loading.tsx         # Skeleton screen (streamed while Suspense resolves)
├── components/
│   ├── books/
│   │   ├── BooksPageClient.tsx # Client component — URL state + TanStack Query wiring
│   │   ├── BookList.tsx        # Loading / error / empty / results rendering
│   │   └── BookCard.tsx        # Single book — cover, title, authors, subject tags
│   ├── filters/
│   │   ├── FilterPanel.tsx     # Composes all filter components
│   │   ├── LanguageFilter.tsx
│   │   ├── CopyrightFilter.tsx
│   │   ├── AuthorYearFilter.tsx
│   │   └── ActiveFilters.tsx   # Dismissible filter chips
│   ├── search/
│   │   └── SearchBar.tsx       # Debounced input (300 ms)
│   ├── pagination/
│   │   └── Pagination.tsx      # Prev / page N of M / Next
│   └── ui/
│       ├── Spinner.tsx
│       ├── ErrorMessage.tsx
│       ├── EmptyState.tsx
│       └── InfoPopover.tsx
├── hooks/
│   ├── useBooks.ts             # TanStack Query hook
│   └── useDebounce.ts
├── lib/
│   ├── gutendex.ts             # fetch wrapper + URL builder + GutendexError
│   ├── query-keys.ts           # Typed query key factory
│   ├── constants.ts            # All magic numbers in one place
│   ├── languages.ts            # ISO 639-1 language list for the language filter
│   └── utils.ts                # Pure utility functions
├── providers/
│   └── QueryProvider.tsx       # QueryClientProvider with default config
├── store/
│   └── useAppStore.ts          # Zustand — recentSearches (persisted)
├── types/
│   └── gutendex.ts             # GutendexBook, GutendexResponse, BookFilters
├── __mocks__/
│   ├── fixtures.ts             # Shared test fixture data
│   └── handlers.ts             # MSW request handlers (Playwright)
└── e2e/
    └── book-search.spec.ts     # Playwright E2E — 3 scenarios
```
