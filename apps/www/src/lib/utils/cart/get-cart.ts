import "server-only"

import { Identity, getCurrentIdentity } from "@/lib/utils/get-current-identity"
import { Cart } from "@/payload-types"
import config from "@payload-config"
import { getPayload, type Where } from "payload"

/**
 * Scopes a query to a single owner. A logged-in user carries both keys, so
 * `user` is preferred over `guestSessionId`.
 */
export function buildCartWhere({ user, guestSessionId }: Identity): Where {
  return user
    ? { user: { equals: user } }
    : { guestSessionId: { equals: guestSessionId } }
}

/** The owner fields to stamp on a newly created cart (prefers `user`). */
export function buildCartOwner({
  user,
  guestSessionId,
}: Identity): { user: string } | { guestSessionId: string } {
  return user ? { user } : { guestSessionId: guestSessionId! }
}

/**
 * Finds the cart belonging to the given identity, or `null` when none exists.
 * Uses the cached Payload instance directly — no instance is threaded in.
 */
export async function findCartByIdentity(
  identity: Identity
): Promise<Cart | null> {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: "carts",
    where: buildCartWhere(identity),
    limit: 1,
    pagination: false,
    depth: 2,
  })

  return docs[0] ?? null
}

/**
 * Resolves the current owner (user or guest) and returns their cart, populated
 * to depth 2. Returns `null` when the owner has no cart yet.
 */
export async function getCart(): Promise<Cart | null> {
  return findCartByIdentity(await getCurrentIdentity())
}
