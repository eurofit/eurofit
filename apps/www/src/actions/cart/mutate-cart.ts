import "server-only"

import { toCartActionError } from "@/lib/utils/cart/cart-action-error"
import { WritableCartItem } from "@/lib/utils/cart/cart-items"
import {
  CART_DETAIL_DEPTH,
  CART_DETAIL_POPULATE,
  findOrCreateCart,
} from "@/lib/utils/cart/get-cart"
import { withCartLock } from "@/lib/utils/cart/with-cart-lock"
import { getCurrentIdentity } from "@/lib/utils/get-current-identity"
import { Cart } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

/**
 * Shared primitive for every cart write. Resolves the owner once, takes the
 * per-owner advisory lock, find-or-creates the cart, applies a pure transform to
 * its items, and writes the result back — never deleting the row, even when the
 * cart ends up empty. The lock serializes concurrent writes so the
 * read-modify-write can't lose updates or hit a deleted row.
 */
export async function mutateOwnerCart(
  apply: (items: Cart["items"]) => WritableCartItem[]
): Promise<ActionResult<Cart>> {
  try {
    const identity = await getCurrentIdentity()

    return await withCartLock(identity, async () => {
      const cart = await findOrCreateCart(identity)
      const payload = await getPayload({ config })

      const updatedCart = await payload.update({
        collection: "carts",
        id: cart.id,
        data: {
          items: apply(cart.items),
          lastActiveAt: new Date().toISOString(),
        },
        depth: CART_DETAIL_DEPTH,
        populate: CART_DETAIL_POPULATE,
      })

      return { success: true, data: updatedCart }
    })
  } catch (error) {
    return toCartActionError(error)
  }
}
