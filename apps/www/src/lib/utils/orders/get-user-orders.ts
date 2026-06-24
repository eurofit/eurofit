import "server-only"

import { captureError } from "@/lib/observability/capture-error"
import { Order } from "@/types/order"
import config from "@payload-config"
import { getPayload } from "payload"
import * as z from "zod"

const inputSchema = z.object({
  userId: z.uuid(),
})

type Args = z.input<typeof inputSchema>

export async function getUserOrders(args: Args): Promise<Order[]> {
  const parsed = inputSchema.safeParse(args)
  if (!parsed.success) return []

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: "orders",
      where: {
        user: { equals: parsed.data.userId },
      },
      select: {
        items: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
      },
      sort: "-createdAt",
      limit: 20,
      depth: 0,
    })

    return docs.map(({ items, ...order }) => order)
  } catch (error) {
    captureError(error, { scope: "orders.get-user-orders" })
    return []
  }
}
