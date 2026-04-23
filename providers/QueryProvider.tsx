'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { QUERY_STALE_TIME_DEFAULT, QUERY_GC_TIME, QUERY_DEFAULT_RETRY } from '@/lib/constants'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_STALE_TIME_DEFAULT,
            gcTime: QUERY_GC_TIME,
            retry: QUERY_DEFAULT_RETRY,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
