"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { site } from "@/const/site"
import { env } from "@/env.mjs"
import { paystack } from "@/lib/paystack"
import { addressWithIdSchema } from "@/lib/schemas/addresses/address"
import { orderSchema } from "@/lib/schemas/orders/order"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { Order } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { after } from "next/server"
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

export async function checkout(
  unSafCheckoutData: CheckoutArgs,
  turnstileToken: string
): Promise<ActionResult<{ authorization_url: string }>> {
  const isTurnstileValid = await verifyTurnstile(
    turnstileToken,
    env.CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY
  )
  if (!isTurnstileValid) {
    return { success: false, code: 400, message: "CAPTCHA validation failed." }
  }

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
    return {
      success: false,
      code: 401,
      message: "You must be signed in to checkout.",
    }
  }

  // verify address ownership
  const { docs: addresses } = await payload.find({
    collection: "addresses",
    where: {
      id: { equals: addressId },
      user: { equals: user.id },
    },
    user: user,
    limit: 1,
    depth: 0,
    pagination: false,
  })

  const address = addresses[0]

  if (!address) {
    return {
      success: false,
      code: 404,
      message: "Address not found or does not belong to your account.",
    }
  }

  try {
    //This is done in: before change hook in orders collection
    // verify stock availability
    // verify items price

    // proceed to create order
    const order = await payload.create({
      collection: "orders",
      data: {
        user: user.id,
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
      overrideAccess: true,
    })

    // check order total amount
    if (!order.total) {
      return {
        success: false,
        code: 500,
        message: "Order total could not be calculated.",
      }
    }

    const amount = order.total * 100

    const res = await paystack.transaction.initialize({
      reference: order.id.toString(),
      email: user.email,
      amount: amount.toString(),
      currency: "KES",
      callback_url: `${site.url}/thank-you/${order.id}`,
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
      return {
        success: false,
        code: 502,
        message: "Payment gateway is unavailable. Please try again.",
      }
    }

    after(async () => {
      // update order with paystack access code so we can recharge if the user
      // does not complete the payment after being redirected to paystack
      await payload.update({
        collection: "orders",
        id: order.id,
        data: {
          paystackAccessCode: res.data.access_code,
        },
        overrideAccess: true,
      })
    })

    return {
      success: true,
      data: { authorization_url: res.data.authorization_url },
    }
  } catch {
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    }
  }
}
