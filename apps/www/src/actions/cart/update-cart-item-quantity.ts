"use server"

import {
  CartQuantity,
  updateCartQuantitySchema,
} from "@/lib/schemas/cart/update-quantity"
import { invalidCartInput } from "@/lib/utils/cart/cart-action-error"
import { setItemQuantity } from "@/lib/utils/cart/cart-items"
import { Cart } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import { mutateOwnerCart } from "./mutate-cart"

/** Sets a cart line's quantity to an exact, positive value. */
export async function updateCartItemQuantity(
  input: CartQuantity
): Promise<ActionResult<Cart>> {
  const parsed = updateCartQuantitySchema.safeParse(input)
  if (!parsed.success) return invalidCartInput()

  const { productVariantId, quantity } = parsed.data

  return mutateOwnerCart((items) =>
    setItemQuantity({ items, productVariantId, quantity })
  )
}
