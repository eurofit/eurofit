import { Order, Transaction } from "@/payload-types"
import { CollectionAfterChangeHook } from "payload"

// TODO: make it transactional, do not create a new transaction if the order is already paid or refunded or if the amount is not correct
export const markOrderPaid: CollectionAfterChangeHook<Transaction> = async ({
  operation,
  req,
  doc,
  context,
}) => {
  if (operation !== "create") {
    return
  }

  // verify the correct amount was paid
  const isOrderPopulated = typeof doc.order === "object" && doc.order !== null
  const orderId = typeof doc.order === "number" ? doc.order : doc.order.id

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

  if (order.total !== doc.amount) {
    // do nothing if the amounts don't match
    return
  }

  // mark the order as paid
  await req.payload.update({
    id: orderId,
    collection: "orders",
    data: {
      paymentStatus: "paid",
    },
    req,
  })
}
