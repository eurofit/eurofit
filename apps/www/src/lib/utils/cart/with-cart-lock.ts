import "server-only"

import { Identity } from "@/lib/utils/get-current-identity"
import config from "@payload-config"
import { getPayload } from "payload"

/** Lock class id that distinguishes cart locks from any other advisory locks. */
const CART_LOCK_NAMESPACE = 42

/** Stable owner key for the lock: prefers the user id, else the guest session id. */
export function cartOwnerKey({ user, guestSessionId }: Identity): string {
  return user ? `user:${user}` : `guest:${guestSessionId}`
}

/**
 * Runs `fn` while holding a per-owner Postgres advisory lock, so concurrent cart
 * writes — even across tabs, devices, or app instances — serialize instead of
 * racing the read-modify-write on the cart's `items`.
 *
 * The lock is held on a dedicated pooled client while Payload performs the
 * find/update on its own pool connections; advisory locks block across sessions,
 * so other requests for the same owner wait at `pg_advisory_lock` until this one
 * releases. The unlock + release run in `finally` so the client is never leaked.
 */
export async function withCartLock<T>(
  identity: Identity,
  fn: () => Promise<T>
): Promise<T> {
  const payload = await getPayload({ config })
  const client = await payload.db.pool.connect()
  const key = cartOwnerKey(identity)

  try {
    await client.query("SELECT pg_advisory_lock($1, hashtext($2))", [
      CART_LOCK_NAMESPACE,
      key,
    ])

    return await fn()
  } finally {
    try {
      await client.query("SELECT pg_advisory_unlock($1, hashtext($2))", [
        CART_LOCK_NAMESPACE,
        key,
      ])
    } catch {
      // If the unlock query fails (e.g. transient network blip), swallow it.
      // Postgres will release the advisory lock automatically when the
      // connection is returned to the pool and the session resets.
    } finally {
      client.release()
    }
  }
}
