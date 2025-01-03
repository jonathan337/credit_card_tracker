'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useRef, type PropsWithChildren } from 'react'

export function Providers({ children }: PropsWithChildren) {
  // This ensures the QueryClient is only created once
  const queryClientRef = useRef<QueryClient>()
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          // During SSR, we want to keep cached data
          staleTime: Infinity,
          // Disable retries during SSR
          retry: false,
          // Disable prefetching during SSR
          refetchOnWindowFocus: false,
        },
      },
    })
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  )
}

