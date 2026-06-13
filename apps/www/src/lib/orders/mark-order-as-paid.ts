import config from "@/payload.config"
import { getPayload } from "payload"

export async function markOrderAsPaid(orderId: number | string) {
  const payload = await getPayload({ config })

  await payload.update({
    collection: "orders",
    id: orderId,
    data: { paymentStatus: "paid" },
    overrideAccess: true,
  })
}
