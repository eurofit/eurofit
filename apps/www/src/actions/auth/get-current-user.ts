"use server"

import config from "@/payload.config"
import { safeUserSchema } from "@/schemas/safe-user"
import { headers as getHeaders } from "next/headers"
import { getPayload } from "payload"

export const getCurrentUser = async () => {
  const [headers, payload] = await Promise.all([
    getHeaders(),
    getPayload({ config }),
  ])

  const { user } = await payload.auth({
    headers,
  })

  if (!user) return null

  return safeUserSchema.parse({
    ...user,
    isVerified: user._verified ?? false,
    addresses:
      user.addresses?.docs
        ?.filter((a) => typeof a !== "string")
        .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)) ?? [],
  })
}

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>
