import { env } from "@/env.mjs"
import { clearCustomerCart } from "@/lib/cart/clear-customer-cart"
import { resolveOrderForPayment } from "@/lib/orders/resolve-order-for-payment"
import { verifyPaystackTransaction } from "@/lib/payment/verify-paystack-transaction"
import config from "@/payload.config"
import { getPayload } from "payload"

export async function handleChargeSuccess(eventData: { reference: string }) {
  const verified = await verifyPaystackTransaction(eventData.reference)

  if (verified.status !== "success") return

  const isTestPayment = verified.domain !== "live"
  if (env.NODE_ENV === "production" && isTestPayment) return

  const order = await resolveOrderForPayment(verified.reference)
  if (!order) return

  const payload = await getPayload({ config })

  await payload.create({
    collection: "transactions",
    data: {
      order: order.id,
      ref: verified.reference,
      amount: verified.amount / 100,
      provider: "paystack",
      isTest: isTestPayment,
      paidAt: verified.paid_at.toISOString(),
      snapshot: verified as unknown as Record<string, unknown>,
    },
    overrideAccess: true,
  })

  const customerId =
    typeof order.customer === "string" ? order.customer : order.customer.id

  await clearCustomerCart(customerId)
}
