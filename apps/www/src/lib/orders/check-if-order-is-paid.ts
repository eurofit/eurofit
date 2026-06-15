import { Order } from "@/payload-types"

export function checkIfOrderIsPaid(order: Order): boolean {
  return order.paymentStatus === "paid"
}
