import { logger } from "@/lib/observability/capture-error"
import config from "@payload-config"
import { getPayload } from "payload"

export async function clearUserCart(userId: string) {
  const payload = await getPayload({ config })

  const { docs: carts } = await payload.find({
    collection: "carts",
    where: { user: { equals: userId } },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  if (carts[0]) {
    await payload.delete({
      collection: "carts",
      id: carts[0].id,
      overrideAccess: true,
    })
    logger.info(logger.fmt`[clear-cart] deleted cart for user ${userId}`)
    return
  }

  logger.info(logger.fmt`[clear-cart] no cart found for user ${userId}`)
}
