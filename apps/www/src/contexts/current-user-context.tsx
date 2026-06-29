"use client"

import { useQuery } from "@tanstack/react-query"
import * as React from "react"

const CurrentUserContext = React.createContext<string | null>(null)

export function CurrentUserProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: userId = null } = useQuery<string | null>({
    queryKey: ["current-user-id"],
    queryFn: async () => {
      const res = await fetch("/api/me")
      if (!res.ok) return null
      const data = (await res.json()) as { id: string | null }
      return data.id
    },
    staleTime: 1000 * 60 * 5,
  })

  return (
    <CurrentUserContext.Provider value={userId}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUserId(): string | null {
  return React.useContext(CurrentUserContext)
}
