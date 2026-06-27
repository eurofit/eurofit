"use server"

import {
  CartItemId,
  removeCartItemSchema,
} from "@/lib/schemas/cart/remove-item"
import { invalidCartInput } from "@/lib/utils/cart/cart-action-error"
import { removeItem } from "@/lib/utils/cart/cart-items"
import { Cart } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import { mutateOwnerCart } from "./mutate-cart"

/**
 * Removes a line from the owner's cart. Removing the last item leaves the cart
 * empty (`items: []`) rather than deleting it — the row persists so concurrent
 * or later writes never race a deleted cart.
 */
export async function removeCartItem(
  input: CartItemId
): Promise<ActionResult<Cart>> {
  const parsed = removeCartItemSchema.safeParse(input)
  if (!parsed.success) return invalidCartInput()

  const { productVariantId } = parsed.data

  return mutateOwnerCart((items) => removeItem({ items, productVariantId }))
}
