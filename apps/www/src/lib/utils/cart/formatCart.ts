import { Cart } from "@/payload-types"
import { formatCartItem } from "./formatCartItem"

export function formatCart(cart: Cart | null) {
  if (!cart?.items) return []
  return cart.items.map(formatCartItem)
}
