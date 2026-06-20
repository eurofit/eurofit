"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { site } from "@/const/site"
import { env } from "@/env.mjs"
import { captureError } from "@/lib/observability/capture-error"
import type { OrderItemSnapshot } from "@/lib/orders/build-order-item-snapshot"
import { paystack } from "@/lib/paystack"
import { addressWithIdSchema } from "@/lib/schemas/addresses/address"
import { orderSchema } from "@/lib/schemas/orders/order"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { Order } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import * as Sentry from "@sentry/nextjs"
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
  return Sentry.startSpan({ name: "checkout", op: "function" }, () =>
    runCheckout(unSafCheckoutData, turnstileToken)
  )
}

async function runCheckout(
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

  Sentry.setUser({ id: user.id, email: user.email })

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
    const order = await Sentry.startSpan(
      { name: "order.create", op: "db.create" },
      () =>
        payload.create({
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
    )

    Sentry.setTag("order.id", order.id)

    // check order total amount
    if (!order.total) {
      return {
        success: false,
        code: 500,
        message: "Order total could not be calculated.",
      }
    }

    const amount = order.total * 100

    // Build the gateway snapshot from the server-priced order items so the metadata
    // records exactly what was charged (original + discounted unit price).
    const metadataItems = order.items.map((item) => {
      const snapshot = item.snapshot as OrderItemSnapshot
      return {
        id:
          typeof item.productVariant === "string"
            ? item.productVariant
            : item.productVariant.id,
        quantity: item.quantity,
        price: snapshot.price,
        discountedPrice: snapshot.discount?.price ?? snapshot.price,
      }
    })

    let res
    try {
      res = await Sentry.startSpan(
        { name: "paystack.initialize_transaction", op: "http.client" },
        () =>
          paystack.transaction.initialize({
            reference: order.id.toString(),
            email: user.email,
            amount: amount.toString(),
            currency: "KES",
            callback_url: `${site.url}/thank-you/${order.id}`,
            metadata: {
              cancel_action: site.url + "/checkout",
              order_id: order.id.toString(),
              custom_fields: [
                {
                  display_name: "Subtotal",
                  variable_name: "subtotal",
                  value: `KES ${order.subtotal ?? 0}`,
                },
                {
                  display_name: "Discount",
                  variable_name: "discount",
                  value: `KES ${order.discountTotal ?? 0}`,
                },
                {
                  display_name: "Delivery Fee",
                  variable_name: "delivery_fee",
                  value: `KES ${order.deliveryFee ?? 0}`,
                },
                {
                  display_name: "Total",
                  variable_name: "total",
                  value: `KES ${order.total}`,
                },
              ],
              snapshot: {
                items: metadataItems,
                user: {
                  id: user.id,
                  fullName: user.fullName,
                  email: user.email,
                },
                address: addressWithIdSchema.parse(address),
              },
            },
          })
      )
    } catch (error) {
      // The Paystack SDK uses axios with default behaviour (throws on any non-2xx)
      // and no error interceptor, so a rejected request lands here instead of
      // resolving to a { data: null } response. Surface the real reason to
      // Sentry and return a clean message to the client.
      const paystackError =
        (error as { response?: { data?: unknown } })?.response?.data ?? error
      captureError(error, {
        scope: "checkout",
        tags: { stage: "paystack-init", order_id: order.id },
        user: { id: user.id, email: user.email },
        context: { paystackError },
      })
      return {
        success: false,
        code: 502,
        message: "Payment gateway is unavailable. Please try again.",
      }
    }

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
      try {
        await payload.update({
          collection: "orders",
          id: order.id,
          data: {
            paystackAccessCode: res.data.access_code,
          },
          overrideAccess: true,
        })
      } catch (error) {
        captureError(error, {
          scope: "checkout",
          tags: { stage: "access-code-update", order_id: order.id },
        })
      }
    })

    return {
      success: true,
      data: { authorization_url: res.data.authorization_url },
    }
  } catch (error) {
    captureError(error, {
      scope: "checkout",
      tags: { stage: "unexpected" },
      user: { id: user.id, email: user.email },
    })
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    }
  }
}
