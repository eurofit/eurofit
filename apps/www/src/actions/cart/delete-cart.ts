"use server"

import { toCartActionError } from "@/lib/utils/cart/cart-action-error"
import { findCartByIdentity } from "@/lib/utils/cart/get-cart"
import { getCurrentIdentity } from "@/lib/utils/get-current-identity"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

/** Deletes the owner's entire cart. A no-op (success) when there is no cart. */
export async function deleteCart(): Promise<ActionResult<null>> {
  try {
    const cart = await findCartByIdentity(await getCurrentIdentity())

    if (cart) {
      const payload = await getPayload({ config })
      await payload.delete({ collection: "carts", id: cart.id })
    }

    return { success: true, data: null }
  } catch (error) {
    return toCartActionError(error)
  }
}
