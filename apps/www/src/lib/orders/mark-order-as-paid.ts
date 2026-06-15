import { PayloadRequest } from "payload"

export async function markOrderAsPaid(
  orderId: number | string,
  req: PayloadRequest
) {
  await req.payload.update({
    collection: "orders",
    id: orderId,
    data: { paymentStatus: "paid" },
    overrideAccess: true,
    req,
  })
}
