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
  }
}
