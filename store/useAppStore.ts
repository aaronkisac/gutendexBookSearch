import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT_SEARCHES = 5

interface AppState {
  recentSearches: string[]
  addRecentSearch: (term: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addRecentSearch: (term) => {
        if (!term.trim()) return
        set((state) => ({
          recentSearches: [term, ...state.recentSearches.filter((s) => s !== term)].slice(
            0,
            MAX_RECENT_SEARCHES
          ),
        }))
      },
    }),
    { name: 'gutendex-app-store' }
  )
)
