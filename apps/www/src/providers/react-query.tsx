"use client"

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import { getQueryClient } from "@/providers/get-query-client"
import { QueryClientProvider } from "@tanstack/react-query"

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
