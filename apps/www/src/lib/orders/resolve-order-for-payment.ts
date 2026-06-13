import config from "@/payload.config"
import { getPayload } from "payload"

export async function resolveOrderForPayment(reference: string) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: "orders",
    where: {
      and: [
        { id: { equals: reference } },
        { paymentStatus: { equals: "unpaid" } },
      ],
    },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  return docs[0] ?? null
}
