"use server"

import {
  CartItemId,
  removeCartItemSchema,
} from "@/lib/schemas/cart/remove-item"
import {
  invalidCartInput,
  toCartActionError,
} from "@/lib/utils/cart/cart-action-error"
import { removeItem } from "@/lib/utils/cart/cart-items"
import { findCartByIdentity } from "@/lib/utils/cart/get-cart"
import { getCurrentIdentity } from "@/lib/utils/get-current-identity"
import { Cart } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"
import { deleteCart } from "./delete-cart"

/**
 * Removes an item from the owner's cart. When it was the last item the cart is
 * deleted instead (empty carts are not allowed) — delegated to `deleteCart`,
 * since that strict cascade is its own responsibility. The delete is awaited so
 * the cart is gone before the response returns; otherwise a client refetch could
 * race the cascade and read the not-yet-deleted cart.
 */
export async function removeCartItem(
  input: CartItemId
): Promise<ActionResult<Cart | null>> {
  const parsed = removeCartItemSchema.safeParse(input)
  if (!parsed.success) return invalidCartInput()

  const { productVariantId } = parsed.data

  try {
    const cart = await findCartByIdentity(await getCurrentIdentity())

    if (!cart) {
      return { success: false, code: 404, message: "Cart not found." }
    }

    const remainingItems = removeItem({ items: cart.items, productVariantId })

    if (remainingItems.length === 0) {
      const result = await deleteCart()
      if (!result.success) return result
      return { success: true, data: null }
    }

    const payload = await getPayload({ config })

    const updatedCart = await payload.update({
      collection: "carts",
      id: cart.id,
      data: {
        items: remainingItems,
        lastActiveAt: new Date().toISOString(),
      },
    })

    return { success: true, data: updatedCart }
  } catch (error) {
    return toCartActionError(error)
  }
}
