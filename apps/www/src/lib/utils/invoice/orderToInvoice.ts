import { Invoice, invoiceSchema } from "@/lib/schemas/invoice"
import { Order } from "@/payload-types"

export function orderToInvoice(order: Order): Invoice | null {
  if (
    typeof order.deliveryAddress !== "object" ||
    order.deliveryAddress === null
  ) {
    return null
  }

  if (typeof order.user !== "object" || order.user === null) {
    return null
  }

  const items = order.items.map(({ snapshot, ...item }) => ({
    ...item,
    ...(typeof snapshot === "object" && snapshot !== null ? snapshot : {}),
  }))

  // Legacy orders predate the stored subtotal/discount fields, so fall back to
  // recomputing the pre-discount sum from the line snapshots when it's missing.
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

  const formattedOrder = {
    id: order.id.toString(),
    fao: order.user.fullName ?? order.user.firstName,
    date: order.createdAt,
    dueDate: order.createdAt,
    status: order.paymentStatus,
    shippingAddress: order.deliveryAddress,
    items,
    total: order.total,
    subtotal,
    discountTotal: order.discountTotal,
    deliveryFee: order.deliveryFee,
    tax: 0.0,
  }

  return invoiceSchema.parse(formattedOrder)
}
