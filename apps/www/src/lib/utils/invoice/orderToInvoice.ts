import { Invoice, invoiceSchema } from "@/lib/schemas/invoice"
import { Order } from "@/payload-types"

export function orderToInvoice(order: Order): Invoice | null {
  if (typeof order.user !== "object" || order.user === null) {
    return null
  }

  const isPickup = order.fulfillmentType === "pickup"

  if (
    !isPickup &&
    (typeof order.deliveryAddress !== "object" ||
      order.deliveryAddress === null)
  ) {
    return null
  }

  const items = order.items.map(({ snapshot, ...item }) => ({
    ...item,
    ...(typeof snapshot === "object" && snapshot !== null ? snapshot : {}),
  }))

  // Legacy orders predate the stored subtotal/discount fields, so fall back to
  // recomputing both from line snapshots when the stored values are missing.
  const subtotal =
    order.subtotal ??
    order.items.reduce((acc, { snapshot, quantity }) => {
      const price =
        typeof snapshot === "object" &&
        snapshot !== null &&
        !Array.isArray(snapshot) &&
        typeof snapshot.price === "number"
          ? snapshot.price
          : 0
      return acc + price * quantity
    }, 0)

  const discountTotal =
    order.discountTotal ??
    order.items.reduce((acc, { snapshot, quantity }) => {
      if (
        typeof snapshot !== "object" ||
        snapshot === null ||
        Array.isArray(snapshot)
      )
        return acc
      const snap = snapshot as Record<string, unknown>
      const originalPrice =
        typeof snap["price"] === "number" ? snap["price"] : 0
      const discountObj =
        typeof snap["discount"] === "object" && snap["discount"] !== null
          ? (snap["discount"] as Record<string, unknown>)
          : null
      const effectivePrice =
        discountObj !== null && typeof discountObj["price"] === "number"
          ? discountObj["price"]
          : originalPrice
      return acc + (originalPrice - effectivePrice) * quantity
    }, 0)

  const formattedOrder = {
    id: order.id.toString(),
    fao: order.user.fullName ?? order.user.firstName,
    date: order.createdAt,
    dueDate: order.createdAt,
    status: order.paymentStatus,
    isPickup,
    shippingAddress: isPickup ? undefined : order.deliveryAddress,
    items,
    total: order.total,
    subtotal,
    discountTotal,
    deliveryFee: order.deliveryFee,
    tax: 0.0,
  }

  return invoiceSchema.parse(formattedOrder)
}
