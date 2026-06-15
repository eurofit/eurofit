import { Cart } from "@/payload-types"

export type CartItem = Cart["items"][number]

/**
 * The shape Payload accepts when writing cart items back. The relationship is
 * normalized to an id string so the snapshot hook can distinguish unchanged
 * items (already populated → leave alone) from new ones (need a snapshot).
 */
export type WritableCartItem = {
  productVariant: string
  quantity: number
  snapshot?: CartItem["snapshot"]
  id?: string | null
}

/** Reads the product variant id off a cart item regardless of population depth. */
export function getItemVariantId(item: CartItem): string {
  return typeof item.productVariant === "string"
    ? item.productVariant
    : item.productVariant.id
}

/** Normalizes populated cart items into the writable shape Payload expects. */
export function toWritableItems(items: Cart["items"]): WritableCartItem[] {
  return items.map((item) => ({
    productVariant: getItemVariantId(item),
    quantity: item.quantity,
    snapshot: item.snapshot,
    id: item.id,
  }))
}

/** Whether a line for the given variant already exists in the cart. */
export function hasVariant({
  items,
  productVariantId,
}: {
  items: Cart["items"]
  productVariantId: string
}): boolean {
  return items.some((item) => getItemVariantId(item) === productVariantId)
}

/** Increments an existing line's quantity, or appends a new line. */
export function addItem({
  items,
  productVariantId,
  quantity,
}: {
  items: Cart["items"]
  productVariantId: string
  quantity: number
}): WritableCartItem[] {
  const writableItems = toWritableItems(items)
  const isExistingItem = writableItems.some(
    (item) => item.productVariant === productVariantId
  )

  if (isExistingItem) {
    return writableItems.map((item) =>
      item.productVariant === productVariantId
        ? { ...item, quantity: item.quantity + quantity }
        : item
    )
  }

  return [...writableItems, { productVariant: productVariantId, quantity }]
}

/** Sets an existing line's quantity to an exact value. */
export function setItemQuantity({
  items,
  productVariantId,
  quantity,
}: {
  items: Cart["items"]
  productVariantId: string
  quantity: number
}): WritableCartItem[] {
  return toWritableItems(items).map((item) =>
    item.productVariant === productVariantId ? { ...item, quantity } : item
  )
}

/** Removes a line entirely. */
export function removeItem({
  items,
  productVariantId,
}: {
  items: Cart["items"]
  productVariantId: string
}): WritableCartItem[] {
  return toWritableItems(items).filter(
    (item) => item.productVariant !== productVariantId
  )
}
