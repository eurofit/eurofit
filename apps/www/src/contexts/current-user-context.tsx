"use client"

import * as React from "react"

const CurrentUserContext = React.createContext<string | null>(null)

export function CurrentUserProvider({
  userId,
  children,
}: {
  userId: string | null
  children: React.ReactNode
}) {
  return (
    <CurrentUserContext.Provider value={userId}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUserId(): string | null {
  return React.useContext(CurrentUserContext)
}
