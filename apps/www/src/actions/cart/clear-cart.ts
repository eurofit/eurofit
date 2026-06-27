"use server"

import { Cart } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import { mutateOwnerCart } from "./mutate-cart"

/** Empties the owner's cart, keeping the (now empty) cart row in place. */
export async function clearCart(): Promise<ActionResult<Cart>> {
  return mutateOwnerCart(() => [])
}
