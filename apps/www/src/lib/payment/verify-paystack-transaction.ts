import { paystack } from "@/lib/paystack"

export async function verifyPaystackTransaction(reference: string) {
  console.log("[verify-paystack] verifying reference:", reference)

  const res = await paystack.transaction.verify(reference)

  if (!res.status || !res.data) {
    console.log(
      "[verify-paystack] verification returned no data, reference:",
      reference,
      "message:",
      res.message
    )
    throw new Error(`Paystack verification failed for reference: ${reference}`)
  }

  console.log(
    "[verify-paystack] verified, reference:",
    reference,
    "status:",
    res.data.status
  )

  return res.data
}
