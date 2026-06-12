import "server-only"

import { COOKIE_KEYS } from "@/const/keys"
import { isUuid } from "@/lib/is-uuid"
import { cookies as getCookies } from "next/headers"

/**
 * Read-only counterpart to `ensureGuestSessionId`. Returns the current guest
 * session id, or `null` when there isn't a valid one. Never writes a cookie, so
 * it is safe to call from contexts where cookies cannot be mutated (e.g. Next's
 * `after()`).
 */
export async function readGuestSessionId(): Promise<string | null> {
  const cookies = await getCookies()
  const guestSessionId = cookies.get(COOKIE_KEYS.GUEST_SESSION_ID)?.value

  return isUuid(guestSessionId) ? guestSessionId! : null
}
