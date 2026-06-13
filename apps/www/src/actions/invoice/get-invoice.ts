"use server"

import { Invoice } from "@/lib/schemas/invoice"
import { orderToInvoice } from "@/lib/utils/invoice/orderToInvoice"
import config from "@/payload.config"
import { getPayload } from "payload"
import * as z from "zod"

const inputSchema = z.object({
  orderId: z.number(),
})

type Input = z.infer<typeof inputSchema>

export async function getInvoice(unsafeInput: Input): Promise<Invoice | null> {
  const { orderId } = inputSchema.parse(unsafeInput)

  const payload = await getPayload({ config })

  const { docs: orders } = await payload.find({
    collection: "orders",
    where: {
      id: {
        equals: orderId,
      },
    },
    select: {
      user: true,
      deliveryAddress: true,
      createdAt: true,
      items: {
        productLine: true,
        quantity: true,
        snapshot: true,
      },
      paymentStatus: true,
      total: true,
    },
    populate: {
      users: {
        fullName: true,
      },
      addresses: {
        user: false,
        area: false,
        createdAt: false,
        updatedAt: false,
        note: false,
        landmark: false,
        label: false,
        isDefault: false,
      },
    },
    pagination: false,
    limit: 1,
  })

  const order = orders[0]

  if (!order) return null

  return orderToInvoice(order)
}
