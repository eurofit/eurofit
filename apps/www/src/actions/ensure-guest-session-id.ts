"use server"

import { GUEST_SESSION_LIFETIME } from "@/const/guest-session"
import { COOKIE_KEYS } from "@/const/keys"
import { isUuid } from "@/lib/is-uuid"
import { cookies as getCookies } from "next/headers"
import { v7 as uuidv7 } from "uuid"

export async function ensureGuestSessionId() {
  const cookies = await getCookies()
  const existingGuestSessionId = cookies.get(
    COOKIE_KEYS.GUEST_SESSION_ID
  )?.value

  // Already present: return it without re-writing. Skipping the write keeps this
  // safe to call from contexts where cookies cannot be mutated (e.g. Next's
  // `after()`). The sliding-expiry refresh is handled by middleware.
  if (existingGuestSessionId && isUuid(existingGuestSessionId)) {
    return existingGuestSessionId
  }

  const guestSessionId = uuidv7()

  cookies.set(COOKIE_KEYS.GUEST_SESSION_ID, guestSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: GUEST_SESSION_LIFETIME,
    path: "/",
  })

  return guestSessionId
}
