# Gutendex Book Search

A book search application built on top of the [Gutendex API](https://gutendex.com/), which provides Project Gutenberg ebook metadata. Built as a take-home technical test.

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
- **Paginated results** — URL-driven, survives refresh and sharing
- **Loading / error / empty states** across all async transitions
- **Persistent state** — recent searches and favourite IDs stored in localStorage via Zustand

---

## Architecture & Design Decisions

### Core Web Vitals

| Metric | Local (Lighthouse headless) | Expected production |
|---|---|---|
| **FCP** | 1.0 s ✅ | < 1.0 s |
| **LCP** | 14.3 s ❌ | ~2–3 s |
| **TBT** | 840 ms 🟡 | < 200 ms |
| **CLS** | 0 ✅ | 0 |

**Why LCP is high locally:** Lighthouse applies 4× CPU throttling and 4G network throttling. The LCP element is the first book cover image, served through the `/_next/image` optimisation proxy. In a throttled local environment, that proxy cold-fetches from `www.gutenberg.org`, adds optimisation work, and delivers the result over a simulated slow connection — stacking three latencies that do not exist in production.

In production on Vercel:
- The image optimisation cache is pre-warmed and served from the global edge CDN
- `/_next/image` responses are cached with a long TTL after the first request
- Edge CDN proximity reduces image delivery to ~20 ms rather than ~300 ms

**CWV optimisations made:**
- **Server-side prefetch via `HydrationBoundary`** — initial book results are fetched on the server and dehydrated into the HTML, eliminating the client-side waterfall (JS parse → hydrate → API call → render)
- **`priority` on first 3 book covers** — adds `<link rel="preload" as="image">` in `<head>` so the browser prefetches above-fold images before any JS runs
- **`imageSizes: [80, 160, 240]`** — reduces the `srcset` from 17 variants to 3 for 80 px thumbnails, shrinking HTML size and cold optimisation requests
- **`preconnect` to gutendex.com and gutenberg.org** — warms DNS/TLS before the first query fires (~100–200 ms saving)
- **`font-display: swap`** — prevents FOIT on slow connections
- **`gcTime: 10 min`** — TanStack Query cache is retained for 10 minutes, avoiding refetches when navigating back

### Next.js 15 — App Router

The App Router enables a clean separation between the server shell (`app/books/page.tsx`) and the interactive client component (`BooksPageClient`). The server component prefetches the initial book query and dehydrates it into the HTML via `HydrationBoundary`, so the client receives data immediately on hydration without an additional API round-trip.

### URL as the source of truth for filter state

All search query, language, copyright, and page values live in the URL (`?search=&languages=&copyright=&page=`). This means results are shareable and bookmark-able out of the box, and there is no synchronisation problem between UI state and the address bar.

This also means no global store is needed for filter state. I intentionally chose *not* to use Zustand or React Context for this — the URL is a better fit. I reached for Zustand only where localStorage persistence was genuinely needed (recent searches, favourites), which is the pattern the JD is testing for.

### TanStack Query v5

Used for all API data fetching. The query key is `['books', 'list', filters]` — when any filter changes, the URL updates, the component re-reads `useSearchParams()`, and TanStack Query automatically fires a new request. The `placeholderData` option keeps the previous page's results visible while the next page loads (no flash of empty state on pagination).

### Three-layer state architecture

| Layer | Tool | What lives here |
|-------|------|-----------------|
| URL state | `useSearchParams` + `useRouter` | Search query, filters, page number |
| Server state | TanStack Query | Gutendex API responses — caching, loading, error |
| Global UI state | Zustand + `persist` | Recent searches (last 5), favourite book IDs |

### Zustand store

`store/useAppStore.ts` uses the `persist` middleware to sync state to `localStorage`. This demonstrates real-world state management beyond the tutorial level — keeping state minimal and only using a global store for state that genuinely needs to outlive a page visit.

### Typed query keys (`lib/query-keys.ts`)

A small factory (`bookKeys`) produces typed, hierarchical query keys. This makes it straightforward to invalidate all book queries (`bookKeys.all`) or a specific filter combination (`bookKeys.list(filters)`) as the app grows.

---

## Testing

```bash
npm test                  # run all unit tests
npm run test:coverage     # with coverage report
npm run test:e2e          # Playwright E2E (requires built app)
```

### Unit test approach

Tests use **Jest** and **React Testing Library**, testing behaviour rather than implementation:

| File | Type | What it covers |
|------|------|----------------|
| `lib/gutendex.test.ts` | Unit | URL construction, fetch error handling |
| `hooks/useBooks.test.ts` | Integration | TanStack Query hook states (success, error, refetch) |
| `components/books/BookCard.test.tsx` | Unit | Rendering variants (no author, no cover, truncated subjects) |
| `components/books/BookList.test.tsx` | Integration | Loading / error / empty / results states |
| `components/search/SearchBar.test.tsx` | Unit | Debounce timing |
| `components/pagination/Pagination.test.tsx` | Unit | Button disabled states, page change callbacks |

### MSW — a note on Jest compatibility

The plan called for MSW v2 for API mocking in Jest. In practice, MSW v2.7's `rettime` dependency ships as pure ESM, which conflicts with Jest's CommonJS module system. Rather than introduce a complex experimental VM modules setup, I made the pragmatic decision to:

- Mock `fetch` directly with `jest.fn()` in `lib/gutendex.test.ts`
- Mock the `fetchBooks` function with `jest.mock()` in `hooks/useBooks.test.ts`
- Keep MSW in the project for Playwright E2E tests, where the full browser environment supports it natively

This is documented here so reviewers know it was a deliberate choice, not an oversight.

### Intentionally not tested

- `FilterPanel` — `LanguageFilter` and `CopyrightFilter` are tested at the unit level; their integration is covered by E2E
- `BooksPageClient` — end-to-end URL state wiring is best validated in a real browser environment; covered by Playwright
- CSS/visual correctness — out of scope for unit tests; Playwright with visual regression would be the right tool

### Coverage target

~70% line coverage, as a natural result of the tests above. Coverage is not chased for its own sake — untested branches are documented above.

### E2E tests (Playwright)

`e2e/book-search.spec.ts` covers three scenarios against a production build:
1. **Happy path** — search, filter, verify results appear
2. **Empty state** — search term with no results shows the empty state message
3. **Error state** — API unavailable, error message and retry button appear

**A note on the error-state test approach**

The naive approach — `page.route('**/gutendex.com/**', abort)` then change a filter — does not work with this app's SSR + `HydrationBoundary` architecture. Every `router.push()` re-runs the server component, which fetches gutendex.com server-to-server (not through the browser). The `HydrationBoundary` then delivers fresh, successful data to the client before TanStack Query can see any error.

The fix: install Playwright's fake clock **70 seconds ahead** of real time (`page.clock.install({ time: Date.now() + 70_000 })`) before `page.goto()`. Since `staleTime = 60 s` in `QueryProvider`, the SSR-hydrated cache entry is immediately stale on the client. TanStack Query fires `refetchOnMount` as a pure client-side fetch (no URL change, no RSC navigation) directly against gutendex.com — which the route intercept can then abort. After `retry: 1` exhausts, `isError = true` and the `ErrorMessage` component renders.

---

## CI

GitHub Actions runs two jobs on every push and pull request to `main`:

1. **quality** — lint → type-check → unit tests with coverage
2. **e2e** — (needs: quality) build → Playwright chromium tests

---

## What I would add next

Given more time, the natural next steps are:

- **Book detail page** (`/books/[id]`) — fetch a single book, show full description, download links
- **Topic/subject filter** — the Gutendex API supports `topic=` query param
- **Author birth year range filter** — `author_year_start=` / `author_year_end=`
- **Playwright visual regression** — screenshot diffing for UI components
- **Lighthouse CI** — automated Core Web Vitals budget in the CI pipeline
- **Storybook** — isolated component development and documentation
- **Infinite scroll** — as an alternative to page-based pagination for the mobile experience

---

## Folder structure

```
├── app/
│   ├── layout.tsx              # Root layout — QueryProvider, Inter font, global CSS
│   ├── page.tsx                # / → redirect to /books
│   └── books/
│       ├── page.tsx            # Server Component shell + Suspense boundary
│       └── loading.tsx         # Skeleton screen (streamed while Suspense resolves)
├── components/
│   ├── books/
│   │   ├── BooksPageClient.tsx # Client component — URL state + TanStack Query wiring
│   │   ├── BookList.tsx        # Loading / error / empty / results rendering
│   │   └── BookCard.tsx        # Single book — cover, title, authors, subject tags
│   ├── filters/
│   │   ├── FilterPanel.tsx     # Composes LanguageFilter + CopyrightFilter
│   │   ├── LanguageFilter.tsx
│   │   └── CopyrightFilter.tsx
│   ├── search/
│   │   └── SearchBar.tsx       # Debounced input (300 ms)
│   ├── pagination/
│   │   └── Pagination.tsx      # Prev / page N / Next
│   └── ui/
│       ├── Spinner.tsx
│       ├── ErrorMessage.tsx
│       └── EmptyState.tsx
├── hooks/
│   ├── useBooks.ts             # TanStack Query hook
│   └── useDebounce.ts
├── lib/
│   ├── gutendex.ts             # fetch wrapper + URL builder + GutendexError
│   └── query-keys.ts           # Typed query key factory
├── providers/
│   └── QueryProvider.tsx       # 'use client' QueryClientProvider
├── store/
│   └── useAppStore.ts          # Zustand — recentSearches + favouriteIds (persisted)
├── types/
│   └── gutendex.ts             # GutendexBook, GutendexResponse, BookFilters
├── __mocks__/
│   ├── fixtures.ts             # Shared test fixture data (no MSW dependency)
│   ├── handlers.ts             # MSW request handlers (used by Playwright)
│   └── server.ts               # MSW Node server setup
└── e2e/
    └── book-search.spec.ts     # Playwright E2E — 3 tests
```
