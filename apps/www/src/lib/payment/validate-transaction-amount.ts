import isInteger from "lodash/isInteger"
import { APIError } from "payload"

export function validateTransactionAmount(amount: number, orderTotal: number) {
  if (!isInteger(amount) || !isInteger(orderTotal)) {
    throw new APIError(
      "Transaction amounts must be non-negative integers (KES)",
      400,
      null,
      true
    )
  }
  // Underpayment is rejected; paying the exact total or more is accepted.
  if (amount < orderTotal) {
    throw new APIError(
      "Transaction amount is less than order total",
      400,
      null,
      true
    )
  }
}
