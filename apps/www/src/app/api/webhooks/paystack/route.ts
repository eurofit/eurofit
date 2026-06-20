import { captureError, logger } from "@/lib/observability/capture-error"
import { handleChargeSuccess } from "@/lib/payment/handle-charge-success"
import { validatePaystackSignature } from "@/lib/payment/validate-paystack-signature"
import * as Sentry from "@sentry/nextjs"
import { after } from "next/server"

export async function POST(req: Request) {
  let body: { event?: string; data?: { reference?: string } }

  try {
    body = await req.json()
  } catch (error) {
    captureError(error, { scope: "paystack-webhook", tags: { stage: "parse" } })
    return Response.json({ success: false }, { status: 400 })
  }

  const reference = body.data?.reference ?? "unknown"

  logger.info(
    logger.fmt`[paystack-webhook] received event ${body.event ?? "unknown"} reference ${reference}`
  )

  const isPaystackSignatureValid = validatePaystackSignature(
    body,
    req.headers.get("x-paystack-signature")
  )

  if (!isPaystackSignatureValid) {
    logger.warn(
      logger.fmt`[paystack-webhook] rejecting event — invalid signature, reference ${reference}`
    )
    return Response.json({ success: false }, { status: 401 })
  }

  logger.info(
    logger.fmt`[paystack-webhook] signature valid — dispatching, reference ${reference}`
  )

  // Return 200 immediately per Paystack docs — long-running work triggers retries
  after(async () => {
    if (body.event === "charge.success") {
      await Sentry.startSpan(
        {
          name: "paystack.charge_success",
          op: "queue.process",
          attributes: { reference },
        },
        async () => {
          try {
            await handleChargeSuccess(body.data as { reference: string })
          } catch (error) {
            // The customer may already be charged: a failure here means a paid
            // order never gets reconciled, so it must be surfaced (TODOS H-03).
            captureError(error, {
              scope: "paystack-webhook",
              tags: { stage: "handle-charge-success", reference },
            })
          }
        }
      )
      return
    }

    logger.info(
      logger.fmt`[paystack-webhook] ignoring unhandled event ${body.event ?? "unknown"}`
    )
  })

  return Response.json({ success: true })
}
