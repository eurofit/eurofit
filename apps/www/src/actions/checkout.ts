"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { site } from "@/const/site"
import { paystack } from "@/lib/paystack"
import { addressWithIdSchema } from "@/lib/schemas/addresses/address"
import { orderSchema } from "@/lib/schemas/orders/order"
import { Order } from "@/payload-types"
import config from "@/payload.config"
import { getPayload } from "payload"
import * as z from "zod"

const checkoutSchema = orderSchema
  .pick({
    items: true,
  })
  .extend({
    addressId: z.uuid("Address ID must be a valid UUID"),
  })

type CheckoutArgs = z.infer<typeof checkoutSchema>

export async function checkout(unSafCheckoutData: CheckoutArgs) {
  const { items, addressId } = checkoutSchema.parse(unSafCheckoutData)

  const orderItems: Order["items"] = items.map(({ id, ...item }) => ({
    productVariant: id,
    ...item,
  }))

  const [payload, user] = await Promise.all([
    getPayload({ config }),
    getCurrentUser(),
  ])

  if (!user) {
    throw new Error("User must be authenticated to checkout")
  }

  // verify address ownership
  const { docs: addresses } = await payload.find({
    collection: "addresses",
    where: {
      id: { equals: addressId },
      user: { equals: user.id },
    },
    user,
    limit: 1,
    depth: 0,
    pagination: false,
  })

  const address = addresses[0]

  if (!address) {
    throw new Error("Address not found or does not belong to the user")
  }

  //This is done in: before change hook in orders collection
  // verify stock availability
  // verify items price

  // proceed to create order
  const order = await payload.create({
    collection: "orders",
    data: {
      customer: user.id,
      deliveryAddress: address.id,
      items: orderItems,
      status: "pending",
      paymentStatus: "unpaid",
      snapshot: {
        user: {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        address: addressWithIdSchema.parse(address),
      },
    },
    draft: false,
  })

  // check order total amount
  if (!order.total) throw new Error("Order total is missing")

  // init paystack

  const res = await paystack.transaction.initialize({
    reference: order.id.toString(),
    email: user.email,
    amount: (order.total * 100).toString(), // convert to cents
    callback_url: site.url + "/thank-you/" + order.id,
    metadata: {
      cancel_action: site.url + "/checkout",
      order_id: order.id.toString(),
      snapshot: {
        items,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        address: addressWithIdSchema.parse(address),
      },
    },
  })

  if ("data" in res && res.data === null) {
    throw new Error("Failed to initialize payment")
  }

  // update order with paystack access code, so that we can recharge the payment if the user does not complete the payment after being redirected to paystack
  await payload.update({
    collection: "orders",
    id: order.id,
    data: {
      paystackAccessCode: res.data.access_code,
    },
  })

  return res
}
