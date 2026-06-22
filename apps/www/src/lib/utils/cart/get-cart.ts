import "server-only"

import { Identity, getCurrentIdentity } from "@/lib/utils/get-current-identity"
import { Cart } from "@/payload-types"
import config from "@payload-config"
import { getPayload, type PopulateType, type Where } from "payload"

/** Default relationship depth for cart reads (variant → product). */
const CART_DEPTH = 2

/**
 * Depth that reaches the product's `brand`/`categories` relations (one level
 * below the variant's product), which GA4 ecommerce events consume.
 */
const CART_DETAIL_DEPTH = 3

/**
 * Trims the extra depth-3 relations to only the fields the cart actually reads,
 * so populating brand/categories doesn't bloat the response with full records.
 */
const CART_DETAIL_POPULATE: PopulateType = {
  brands: { title: true },
  categories: { title: true },
  media: { url: true },
}

type FindCartOptions = {
  depth?: number
  populate?: PopulateType
}

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
  identity: Identity,
  { depth = CART_DEPTH, populate }: FindCartOptions = {}
): Promise<Cart | null> {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: "carts",
    where: buildCartWhere(identity),
    limit: 1,
    pagination: false,
    depth,
    populate,
  })

  return docs[0] ?? null
}

/**
 * Resolves the current owner (user or guest) and returns their cart. Populated
 * to {@link CART_DETAIL_DEPTH} so brand/categories are available for the cart UI
 * and GA4 ecommerce events. Returns `null` when the owner has no cart yet.
 */
export async function getCart(): Promise<Cart | null> {
  return findCartByIdentity(await getCurrentIdentity(), {
    depth: CART_DETAIL_DEPTH,
    populate: CART_DETAIL_POPULATE,
  })
}
