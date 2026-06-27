"use server"

import { NewCartItem, addCartItemSchema } from "@/lib/schemas/cart/add-item"
import { invalidCartInput } from "@/lib/utils/cart/cart-action-error"
import { addItem } from "@/lib/utils/cart/cart-items"
import { Cart } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import { mutateOwnerCart } from "./mutate-cart"

/**
 * Adds an item to the owner's cart, incrementing the line when the variant is
 * already present. Find-or-creates the cart, so adding to a brand-new cart needs
 * no separate create path.
 */
export async function addCartItem(
  input: NewCartItem
): Promise<ActionResult<Cart>> {
  const parsed = addCartItemSchema.safeParse(input)
  if (!parsed.success) return invalidCartInput()

  const { productVariantId, quantity } = parsed.data

  return mutateOwnerCart((items) =>
    addItem({ items, productVariantId, quantity })
  )
}
