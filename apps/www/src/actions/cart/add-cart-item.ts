"use server"

import { NewCartItem, addCartItemSchema } from "@/lib/schemas/cart/add-item"
import {
  invalidCartInput,
  toCartActionError,
} from "@/lib/utils/cart/cart-action-error"
import { addItem } from "@/lib/utils/cart/cart-items"
import { findCartByIdentity } from "@/lib/utils/cart/get-cart"
import { getCurrentIdentity } from "@/lib/utils/get-current-identity"
import { Cart } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

/**
 * Adds an item to the owner's existing cart, incrementing the line when the
 * variant is already present.
 */
export async function addCartItem(
  input: NewCartItem
): Promise<ActionResult<Cart>> {
  const parsed = addCartItemSchema.safeParse(input)
  if (!parsed.success) return invalidCartInput()

  const { productVariantId, quantity } = parsed.data

  try {
    const cart = await findCartByIdentity(await getCurrentIdentity())

    if (!cart) {
      return { success: false, code: 404, message: "Cart not found." }
    }

    const payload = await getPayload({ config })

    const updatedCart = await payload.update({
      collection: "carts",
      id: cart.id,
      data: {
        items: addItem({ items: cart.items, productVariantId, quantity }),
        lastActiveAt: new Date().toISOString(),
      },
    })

    return { success: true, data: updatedCart }
  } catch (error) {
    return toCartActionError(error)
  }
}
