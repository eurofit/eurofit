import { Cart } from "@/payload-types"

export type CartResponse = { cart: Cart | null }

/** Client-side reader for the current owner's cart via the GET /api/cart route. */
export async function fetchCart(): Promise<Cart | null> {
  const res = await fetch("/api/cart")

  if (!res.ok) {
    throw new Error("Failed to load cart.")
  }

  const { cart } = (await res.json()) as CartResponse

  return cart
}
