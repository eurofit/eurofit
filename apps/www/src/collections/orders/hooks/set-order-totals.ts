import { DELIVERY_FEE } from "@/const/delivery"
import { orderItem } from "@/lib/schemas/orders/order-item"
import { Order } from "@/payload-types"
import { APIError, CollectionBeforeChangeHook } from "payload"
import * as z from "zod"

// Money values are never trusted from the client. The subtotal is recomputed from the
// server-built item snapshots (see validateOrderItems) and the delivery fee + total are
// overwritten here so a tampered request can't set its own prices.
export const setOrderTotals: CollectionBeforeChangeHook<Order> = async ({
  data,
}) => {
  // Only (re)compute when items are part of this write. Partial updates such as
  // paymentStatus or paystackAccessCode leave the stored totals untouched.
  if (!data.items) return data

  const areOrderItemsPopulated = data.items.every(
    (item) => item?.snapshot && item?.quantity
  )

  if (!areOrderItemsPopulated) {
    throw new APIError("Order items are not populated", 400, null, true)
  }

  const formattedItems = data.items.map((item) => ({
    ...item,
    id:
      typeof item.productVariant === "string"
        ? item.productVariant
        : item.productVariant?.id,
  }))

  const items = z.array(orderItem).parse(formattedItems)

  // subtotal is the pre-discount sum; the discount total is the savings across all
  // lines. The effective unit price falls back to the original when no discount applies.
  const subtotal = items.reduce(
    (acc, item) => acc + item.snapshot.price * item.quantity,
    0
  )

  const discountTotal = items.reduce((acc, item) => {
    const effectivePrice = item.snapshot.discount?.price ?? item.snapshot.price
    return acc + (item.snapshot.price - effectivePrice) * item.quantity
  }, 0)

  // Store-pickup orders are not delivered, so the delivery fee is waived.
  const deliveryFee = data.fulfillmentType === "pickup" ? 0 : DELIVERY_FEE

  return {
    ...data,
    subtotal,
    discountTotal,
    deliveryFee,
    total: subtotal - discountTotal + deliveryFee,
  }
}
