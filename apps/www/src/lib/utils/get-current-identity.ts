import "server-only"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { ensureGuestSessionId } from "@/actions/ensure-guest-session-id"

/**
 * Who is making the current request. Both keys are always populated so callers
 * can branch by their own rules — a logged-in user also carries a guest session
 * id (cart code prefers `user`).
 */
export type Identity = { user: string | null; guestSessionId: string | null }

/**
 * Resolves the current request's identity. Mirrors `getCurrentUser`, and always
 * ensures a guest session id exists via `ensureGuestSessionId()`.
 */
export async function getCurrentIdentity(): Promise<Identity> {
  const user = (await getCurrentUser())?.id ?? null
  const guestSessionId = await ensureGuestSessionId()

  return { user, guestSessionId }
}
