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

  const subtotal = items.reduce(
    (acc, item) => acc + item.snapshot.price * item.quantity,
    0
  )

  return {
    ...data,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total: subtotal + DELIVERY_FEE,
  }
}
