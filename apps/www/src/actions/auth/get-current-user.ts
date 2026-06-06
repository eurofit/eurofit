import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { headers as getHeaders } from "next/headers"
import { getPayload } from "payload"

export const getCurrentUser = async () => {
  "use cache: private"
  cacheLife("minutes")

  const [headers, payload] = await Promise.all([
    getHeaders(),
    getPayload({ config }),
  ])

  const { user } = await payload.auth({
    headers,
  })

  if (!user) return null

  cacheTag("current-user", user.id)

  return user
}

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>
