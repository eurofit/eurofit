import "server-only"

import {
  WritableCartItem,
  getItemVariantId,
  toWritableItems,
} from "@/lib/utils/cart/cart-items"
import { readGuestSessionId } from "@/lib/utils/read-guest-session-id"
import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { Cart } from "@/payload-types"
import config from "@payload-config"
import { getPayload } from "payload"

/**
 * Merges the guest cart into the authenticated user's cart on login.
 *
 * Strategy (industry-standard, matches commercetools MergeWithExistingCustomerCart):
 * - No user cart → transfer guest cart ownership (rename guestSessionId → user).
 * - Both carts exist → merge items: keep Math.max(userQty, guestQty) for
 *   duplicate variants, append new guest variants, clamp to current stock,
 *   then delete the guest cart.
 *
 * Fire-and-forget — errors are swallowed, never surfaced to the caller.
 */
export async function mergeCart(userId: string): Promise<void> {
  try {
    const guestSessionId = await readGuestSessionId()
    if (!guestSessionId) return

    const payload = await getPayload({ config })

    const [{ docs: guestCarts }, { docs: userCarts }] = await Promise.all([
      payload.find({
        collection: "carts",
        where: { guestSessionId: { equals: guestSessionId } },
        limit: 1,
        pagination: false,
      }),
      payload.find({
        collection: "carts",
        where: { user: { equals: userId } },
        limit: 1,
        pagination: false,
      }),
    ])

    const guestCart = guestCarts[0]
    if (!guestCart) return

    if (!guestCart.items?.length) {
      await payload.delete({ collection: "carts", id: guestCart.id })
      return
    }

    const userCart = userCarts[0]

    if (!userCart) {
      await payload.update({
        collection: "carts",
        id: guestCart.id,
        data: { guestSessionId: null, user: userId },
      })
      return
    }

    const mergedItems = buildMergedItems(userCart.items, guestCart.items)
    const clampedItems = await clampToStock(mergedItems, payload)

    await Promise.all([
      payload.update({
        collection: "carts",
        id: userCart.id,
        data: { items: clampedItems, lastActiveAt: new Date().toISOString() },
      }),
      payload.delete({ collection: "carts", id: guestCart.id }),
    ])
  } catch {
    // Merge is best-effort; never surface errors to the caller.
  }
}

function buildMergedItems(
  userItems: Cart["items"],
  guestItems: Cart["items"]
): WritableCartItem[] {
  const result = toWritableItems(userItems)

  for (const guestItem of guestItems ?? []) {
    const variantId = getItemVariantId(guestItem)
    const existingIndex = result.findIndex(
      (item) => item.productVariant === variantId
    )

    if (existingIndex >= 0) {
      const existing = result[existingIndex]!
      result[existingIndex] = {
        ...existing,
        quantity: Math.max(existing.quantity, guestItem.quantity),
      }
    } else {
      result.push({
        productVariant: variantId,
        quantity: guestItem.quantity,
        snapshot: guestItem.snapshot,
      })
    }
  }

  return result
}

async function clampToStock(
  items: WritableCartItem[],
  payload: Awaited<ReturnType<typeof getPayload>>
): Promise<WritableCartItem[]> {
  if (!items.length) return items

  const variantIds = items.map((item) => item.productVariant)

  const { docs: variants } = await payload.find({
    collection: "product-variants",
    where: {
      id: { in: variantIds },
      isActive: { equals: true },
      retailPrice: { exists: true },
    },
    select: { stock: true, supplierStock: true, isOutOfStock: true },
    pagination: false,
  })

  const stockMap = new Map(
    variants.map((v) => [
      v.id,
      {
        stock: v.stock,
        supplierStock: v.supplierStock,
        isOutOfStock: v.isOutOfStock,
      },
    ])
  )

  return items.flatMap((item) => {
    const variantStock = stockMap.get(item.productVariant)
    if (!variantStock || variantStock.isOutOfStock) return []

    const available = resolveAvailableStock(
      variantStock.stock,
      variantStock.supplierStock
    )
    if (available <= 0) return []

    return [{ ...item, quantity: Math.min(item.quantity, available) }]
  })
}
