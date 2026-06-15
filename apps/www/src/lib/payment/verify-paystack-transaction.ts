import { paystack } from "@/lib/paystack"

export async function verifyPaystackTransaction(reference: string) {
  const res = await paystack.transaction.verify(reference)

  if (!res.status || !res.data) {
    throw new Error(`Paystack verification failed for reference: ${reference}`)
  }

  return res.data
}
