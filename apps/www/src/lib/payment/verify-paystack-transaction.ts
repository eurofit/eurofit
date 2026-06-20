import { logger } from "@/lib/observability/capture-error"
import { paystack } from "@/lib/paystack"

export async function verifyPaystackTransaction(reference: string) {
  logger.info(logger.fmt`[verify-paystack] verifying reference ${reference}`)

  const res = await paystack.transaction.verify(reference)

  if (!res.status || !res.data) {
    logger.warn(
      logger.fmt`[verify-paystack] verification returned no data, reference ${reference} message ${res.message ?? "none"}`
    )
    throw new Error(`Paystack verification failed for reference: ${reference}`)
  }

  logger.info(
    logger.fmt`[verify-paystack] verified, reference ${reference} status ${res.data.status}`
  )

  return res.data
}
