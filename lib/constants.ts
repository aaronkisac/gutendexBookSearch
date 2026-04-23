// Gutendex API
export const GUTENDEX_BASE_URL = 'https://gutendex.com'
export const GUTENDEX_PAGE_SIZE = 32

// TanStack Query
export const QUERY_STALE_TIME_SHORT = 60 * 1000       // 1 min — server prefetch
export const QUERY_STALE_TIME_DEFAULT = 5 * 60 * 1000 // 5 min — client queries
export const QUERY_GC_TIME = 10 * 60 * 1000           // 10 min
export const QUERY_DEFAULT_RETRY = 1

// Search
export const SEARCH_DEBOUNCE_MS = 300
export const MAX_RECENT_SEARCHES = 5
export const SERVER_PREFETCH_TIMEOUT_MS = 3000

// UI display
export const SKELETON_ITEM_COUNT = 5
export const MAX_VISIBLE_SUBJECTS = 4
export const PRIORITY_IMAGE_THRESHOLD = 3

// Filters
export const MAX_AUTHOR_YEAR = 2025
