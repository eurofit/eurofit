import { Cart } from "@/payload-types"
import { CartItem, getItemVariantId, hasVariant } from "./cart-items"

/** Display data for an item being added optimistically before the server confirms. */
export type CartItemPreview = Pick<CartItem, "productVariant" | "snapshot">

const OPTIMISTIC_CART_ID = "optimistic"

/** Sums `snapshot.retailPrice × quantity` across items. */
export function recomputeTotal(items: Cart["items"]): number {
  return items.reduce((sum, item) => {
    const retailPrice = item.snapshot?.retailPrice ?? 0

    return sum + retailPrice * item.quantity
  }, 0)
}

function withTotal(cart: Cart): Cart {
  return { ...cart, total: recomputeTotal(cart.items) }
}

function makeOptimisticCart(items: Cart["items"]): Cart {
  const now = new Date().toISOString()

  return {
    id: OPTIMISTIC_CART_ID,
    items,
    total: recomputeTotal(items),
    lastActiveAt: now,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Optimistic cart after adding `quantity` of a variant. Increments an existing
 * line; otherwise needs `optimisticItem` to render a new line — without it the
 * cart is returned unchanged and reconciles on the settle refetch.
 */
export function applyAddToCart({
  cart,
  productVariantId,
  quantity,
  optimisticItem,
}: {
  cart: Cart | null
  productVariantId: string
  quantity: number
  optimisticItem?: CartItemPreview
}): Cart | null {
  if (cart && hasVariant({ items: cart.items, productVariantId })) {
    return withTotal({
      ...cart,
      items: cart.items.map((item) =>
        getItemVariantId(item) === productVariantId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ),
    })
  }

  if (!optimisticItem) return cart

  const newItem: CartItem = { ...optimisticItem, quantity }

  if (!cart) {
    return makeOptimisticCart([newItem])
  }

  return withTotal({ ...cart, items: [...cart.items, newItem] })
}

/** Optimistic cart after setting a variant's quantity to an exact value. */
export function applySetQuantity({
  cart,
  productVariantId,
  quantity,
}: {
  cart: Cart | null
  productVariantId: string
  quantity: number
}): Cart | null {
  if (!cart) return cart

  return withTotal({
    ...cart,
    items: cart.items.map((item) =>
      getItemVariantId(item) === productVariantId ? { ...item, quantity } : item
    ),
  })
}

/**
 * Optimistic cart after removing a variant. Keeps the cart object with an empty
 * `items` array when the last line leaves — the server keeps the row too, so the
 * UI's empty state (driven by item count) renders without flipping to `null`.
 */
export function applyRemoveItem({
  cart,
  productVariantId,
}: {
  cart: Cart | null
  productVariantId: string
}): Cart | null {
  if (!cart) return cart

  const items = cart.items.filter(
    (item) => getItemVariantId(item) !== productVariantId
  )

  return withTotal({ ...cart, items })
}

/** Optimistic cart after clearing every line, keeping the (empty) cart object. */
export function applyClearCart(cart: Cart | null): Cart | null {
  if (!cart) return cart

  return withTotal({ ...cart, items: [] })
}
