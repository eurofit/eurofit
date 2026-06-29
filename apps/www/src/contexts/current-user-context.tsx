"use client"

import { payloadSDK } from "@/payload-sdk"
import { PayloadSDKError } from "@payloadcms/sdk"
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
      try {
        const { user } = await payloadSDK.me({ collection: "users" })
        return user?.id ?? null
      } catch (error) {
        if (error instanceof PayloadSDKError && error.status === 401)
          return null
        return null
      }
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
