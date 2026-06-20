export type Order = {
  id: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "unpaid" | "paid" | "refunded"
  total?: number | null
  createdAt: string
}
