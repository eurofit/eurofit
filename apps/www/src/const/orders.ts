// answers: "What are we doing with the order?" | "Where is my order?"
export const orderStatus = [
  {
    label: "Pending",
    value: "pending" as const,
  },
  {
    label: "Processing",
    value: "processing" as const,
  },
  {
    label: "Shipped",
    value: "shipped" as const,
  },
  {
    label: "Delivered",
    value: "delivered" as const,
  },
  {
    label: "Cancelled",
    value: "cancelled" as const,
  },
]

export const orderStatusMap = new Map(
  orderStatus.map((status) => [status.value, status])
)

// answers: "Did we get the money?"
export const paymentStatus = [
  { label: "Unpaid", value: "unpaid" as const },
  { label: "Paid", value: "paid" as const },
  { label: "Refunded", value: "refunded" as const },
]

export const paymentStatusMap = new Map(
  paymentStatus.map((status) => [status.value, status])
)

// answers: "How does the customer receive the order?"
export const fulfillmentType = [
  { label: "Delivery", value: "delivery" as const },
  { label: "Store Pickup", value: "pickup" as const },
]

export const fulfillmentTypeMap = new Map(
  fulfillmentType.map((type) => [type.value, type])
)
