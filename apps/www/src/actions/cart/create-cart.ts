"use server"

import { NewCartItem, addCartItemSchema } from "@/lib/schemas/cart/add-item"
import {
  invalidCartInput,
  toCartActionError,
} from "@/lib/utils/cart/cart-action-error"
import { buildCartOwner } from "@/lib/utils/cart/get-cart"
import { getCurrentIdentity } from "@/lib/utils/get-current-identity"
import { Cart } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

/** Creates a cart seeded with its first item. */
export async function createCart(
  input: NewCartItem
): Promise<ActionResult<Cart>> {
  const parsed = addCartItemSchema.safeParse(input)
  if (!parsed.success) return invalidCartInput()

  const { productVariantId, quantity } = parsed.data

  try {
    const [identity, payload] = await Promise.all([
      getCurrentIdentity(),
      getPayload({ config }),
    ])

    const cart = await payload.create({
      collection: "carts",
      data: {
        ...buildCartOwner(identity),
        items: [{ productVariant: productVariantId, quantity }],
        lastActiveAt: new Date().toISOString(),
      },
    })

    return { success: true, data: cart }
  } catch (error) {
    return toCartActionError(error)
  }
}
