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

  const formattedOrder = {
    id: order.id.toString(),
    fao: order.user.fullName ?? order.user.firstName,
    date: order.createdAt,
    dueDate: order.createdAt,
    status: order.paymentStatus,
    shippingAddress: order.deliveryAddress,
    items: order.items.map(({ snapshot, ...item }) => ({
      ...item,
      ...(typeof snapshot === "object" && snapshot !== null ? snapshot : {}),
    })),
    total: order.total,
    subtotal: order.total,
    deliveryFee: 0.0,
    tax: 0.0,
  }

  return invoiceSchema.parse(formattedOrder)
}
