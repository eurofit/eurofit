import { checkIfOrderIsPaid } from "@/lib/orders/check-if-order-is-paid"
import { markOrderAsPaid } from "@/lib/orders/mark-order-as-paid"
import { Order, Transaction } from "@/payload-types"
import { CollectionAfterChangeHook } from "payload"

export const markOrderPaid: CollectionAfterChangeHook<Transaction> = async ({
  operation,
  req,
  doc,
  context,
}) => {
  if (operation !== "create") return

  const isOrderPopulated = typeof doc.order === "object" && doc.order !== null
  const orderId =
    typeof doc.order === "number" ? doc.order : (doc.order as Order).id

  let order: Order

  if (isOrderPopulated) {
    order = doc.order as Order
  } else if (context.order) {
    order = context.order as Order
  } else {
    order = await req.payload.findByID({
      id: orderId,
      collection: "orders",
      req,
    })
  }

  if (checkIfOrderIsPaid(order)) return
  // Only block on underpayment; paying the exact total or more marks the order paid.
  if (order.total == null || doc.amount < order.total) return

  await markOrderAsPaid(orderId, req)

  // Reflect the paid status on the shared order so the confirmation email hook
  // (which runs next and reads context.order) stamps the invoice as paid.
  order.paymentStatus = "paid"
  context.order = order
}
