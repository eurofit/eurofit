import { clearUserCart } from "@/lib/cart/clear-user-cart"
import { resolveOrderForPayment } from "@/lib/orders/resolve-order-for-payment"
import { verifyPaystackTransaction } from "@/lib/payment/verify-paystack-transaction"
import config from "@payload-config"
import { getPayload } from "payload"

export async function handleChargeSuccess(eventData: { reference: string }) {
  console.log("[handle-charge-success] start, reference:", eventData.reference)

  const verified = await verifyPaystackTransaction(eventData.reference)

  if (verified.status !== "success") {
    console.log(
      "[handle-charge-success] aborting — verification status is not success:",
      verified.status,
      "reference:",
      verified.reference
    )
    return
  }

  const isTestPayment = verified.domain !== "live"

  const order = await resolveOrderForPayment(verified.reference)
  if (!order) {
    console.log(
      "[handle-charge-success] aborting — no unpaid order found, reference:",
      verified.reference
    )
    return
  }

  const payload = await getPayload({ config })

  await payload.create({
    collection: "transactions",
    data: {
      order: order.id,
      ref: verified.reference,
      amount: Math.round(verified.amount / 100),
      provider: "paystack",
      isTest: isTestPayment,
      paidAt: new Date(verified.paid_at).toISOString(),
      snapshot: verified as unknown as Record<string, unknown>,
    },
    // Reuse the order already loaded by resolveOrderForPayment so the transaction
    // hooks don't refetch it.
    context: { order },
    overrideAccess: true,
  })

  console.log(
    "[handle-charge-success] transaction created, order:",
    order.id,
    "reference:",
    verified.reference
  )

  const userId = typeof order.user === "string" ? order.user : order.user.id

  await clearUserCart(userId)

  console.log("[handle-charge-success] done, cart cleared for user:", userId)
}
