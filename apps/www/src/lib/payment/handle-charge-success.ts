import { clearUserCart } from "@/lib/cart/clear-user-cart"
import { logger } from "@/lib/observability/capture-error"
import { resolveOrderForPayment } from "@/lib/orders/resolve-order-for-payment"
import { verifyPaystackTransaction } from "@/lib/payment/verify-paystack-transaction"
import config from "@payload-config"
import * as Sentry from "@sentry/nextjs"
import { getPayload } from "payload"

export async function handleChargeSuccess(eventData: { reference: string }) {
  logger.info(
    logger.fmt`[handle-charge-success] start, reference ${eventData.reference}`
  )

  const verified = await Sentry.startSpan(
    { name: "paystack.verify_transaction", op: "http.client" },
    () => verifyPaystackTransaction(eventData.reference)
  )

  if (verified.status !== "success") {
    logger.warn(
      logger.fmt`[handle-charge-success] aborting — verification status ${verified.status} reference ${verified.reference}`
    )
    return
  }

  const isTestPayment = verified.domain !== "live"

  const order = await Sentry.startSpan(
    { name: "order.resolve_for_payment", op: "db.query" },
    () => resolveOrderForPayment(verified.reference)
  )
  if (!order) {
    // Charged but no matching unpaid order — the M-08 orphan-charge case.
    logger.warn(
      logger.fmt`[handle-charge-success] aborting — no unpaid order found, reference ${verified.reference}`
    )
    return
  }

  const payload = await getPayload({ config })

  await Sentry.startSpan(
    {
      name: "transaction.create",
      op: "db.create",
      attributes: { order_id: order.id, reference: verified.reference },
    },
    () =>
      payload.create({
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
  )

  logger.info(
    logger.fmt`[handle-charge-success] transaction created, order ${order.id} reference ${verified.reference}`
  )

  const userId = typeof order.user === "string" ? order.user : order.user.id

  await Sentry.startSpan(
    { name: "cart.clear", op: "db.delete", attributes: { user_id: userId } },
    () => clearUserCart(userId)
  )

  logger.info(
    logger.fmt`[handle-charge-success] done, cart cleared for user ${userId}`
  )
}
