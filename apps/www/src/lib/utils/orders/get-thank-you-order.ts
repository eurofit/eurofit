import "server-only"

import { CurrentUser } from "@/actions/auth/get-current-user"
import { captureError } from "@/lib/observability/capture-error"
import { addressSchema } from "@/lib/schemas/addresses/address"
import { orderItemSnapShotSchema } from "@/lib/schemas/orders/item-snapshort"
import { orderItem } from "@/lib/schemas/orders/order-item"
import { User } from "@/payload-types"
import config from "@payload-config"
import { getPayload } from "payload"
import * as z from "zod"

const inputSchema = z.object({
  orderId: z.number().int().positive(),
  user: z.object({ id: z.string().uuid() }),
})

const itemSchema = orderItemSnapShotSchema.extend(
  orderItem.pick({ id: true, quantity: true }).shape
)

type OrderDoc = NonNullable<Awaited<ReturnType<typeof fetchOrder>>>

export type ThankYouOrderData = {
  order: OrderDoc
  formattedItems: z.infer<typeof itemSchema>[]
  /** Undefined for store-pickup orders, which have no delivery address. */
  shippingAddress: z.infer<typeof addressSchema> | undefined
}

async function fetchOrder(orderId: number, user: User) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: "orders",
    where: {
      and: [{ id: { equals: orderId } }, { user: { equals: user.id } }],
    },
    select: {
      items: {
        productVariant: true,
        quantity: true,
        snapshot: true,
      },
      snapshot: true,
      fulfillmentType: true,
      subtotal: true,
      discountTotal: true,
      deliveryFee: true,
      total: true,
      createdAt: true,
      estimatedDelivery: {
        minDate: true,
        maxDate: true,
      },
      shipTogether: true,
    },
    overrideAccess: false,
    user,
    depth: 2,
    limit: 1,
    pagination: false,
    showHiddenFields: false,
  })

  return docs[0] ?? null
}

export async function getThankYouOrder(args: {
  orderId: number
  user: NonNullable<CurrentUser>
}): Promise<ThankYouOrderData | null> {
  const parsed = inputSchema.safeParse(args)
  if (!parsed.success) return null

  try {
    const order = await fetchOrder(args.orderId, args.user as unknown as User)
    if (!order) return null

    const items = order.items!.map(({ snapshot, ...item }) => ({
      ...item,
      ...(typeof snapshot === "object" ? snapshot : {}),
      id:
        typeof item.productVariant === "string"
          ? item.productVariant
          : item.productVariant!.id,
    }))

    const formattedItems = z.array(itemSchema).parse(items)
    // Store-pickup orders carry no address in their snapshot.
    const snapshotAddress = (order.snapshot as any)?.address
    const shippingAddress = snapshotAddress
      ? addressSchema.parse(snapshotAddress)
      : undefined

    return { order, formattedItems, shippingAddress }
  } catch (error) {
    captureError(error, { scope: "orders.get-thank-you-order" })
    return null
  }
}
