import { orderItem } from "@/lib/schemas/orders/order-item"
import { Order } from "@/payload-types"
import { APIError, FieldHook } from "payload"
import * as z from "zod"

export const getOrderTotal: FieldHook<Order, Order["total"], Order> = async ({
  data,
}) => {
  if (!data) {
    throw new APIError("Order not found", 400, null, true)
  }

  if (!("items" in data) || !data.items) {
    throw new APIError("Order items are missing", 400, null, true)
  }

  const areOrderItemsPopulated =
    data?.items?.every((item) => item?.snapshot && item?.quantity) ?? false

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

  const total = items.reduce((acc, item) => {
    return acc + item.snapshot.price * item.quantity
  }, 0)

  return total
}
