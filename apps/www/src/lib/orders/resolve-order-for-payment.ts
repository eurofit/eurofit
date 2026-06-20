import { logger } from "@/lib/observability/capture-error"
import config from "@payload-config"
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

  const order = docs[0] ?? null

  if (order) {
    logger.info(logger.fmt`[resolve-order] found unpaid order ${order.id}`)
  } else {
    logger.warn(
      logger.fmt`[resolve-order] no unpaid order for reference ${reference}`
    )
  }

  return order
}
