import { APIError } from "payload"

export function validateTransactionAmount(amount: number, orderTotal: number) {
  if (amount !== orderTotal) {
    throw new APIError(
      "Transaction amount does not match order total",
      400,
      null,
      true
    )
  }
}
