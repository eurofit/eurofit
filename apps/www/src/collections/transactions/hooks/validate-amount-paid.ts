import { validateTransactionAmount } from "@/lib/payment/validate-transaction-amount"
import { Order, Transaction } from "@/payload-types"
import { APIError, CollectionBeforeChangeHook } from "payload"

export const validatePaidAmount: CollectionBeforeChangeHook<
  Transaction
> = async ({ data: transaction, req, operation, context }) => {
  if (operation !== "create") return

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

  if (!order.total) {
    throw new APIError("Order total is missing", 400, null, true)
  }

  if (transaction.amount === undefined || transaction.amount === null) {
    throw new APIError("Transaction amount is required", 400, null, true)
  }

  validateTransactionAmount(transaction.amount, order.total)

  context.order = order

  return transaction
}
