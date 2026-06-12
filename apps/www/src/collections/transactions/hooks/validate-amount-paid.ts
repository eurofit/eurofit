import { Order, Transaction } from "@/payload-types"
import { APIError, CollectionBeforeChangeHook } from "payload"

// before you create a transaction, check if the amount paid matches the order total, if not throw an error and do not create the transaction
export const validatePaidAmount: CollectionBeforeChangeHook<
  Transaction
> = async ({ data: transaction, req, operation, context }) => {
  if (operation !== "create") {
    return
  }

  const isOrderPopulated =
    typeof transaction.order === "object" && transaction.order !== null
  const orderId =
    typeof transaction.order === "number"
      ? transaction.order
      : (transaction.order as Order).id

  let order: Order

  if (isOrderPopulated) {
    order = transaction.order as Order
  } else {
    order = await req.payload.findByID({
      id: orderId,
      collection: "orders",
      req,
    })
  }

  if (transaction.amount && transaction.amount !== order.total) {
    throw new APIError("Invalid transaction amount")
  }

  // use the context to pass the order to the afterChange hook
  context.order = order

  return transaction
}
