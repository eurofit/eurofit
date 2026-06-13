import { handleChargeSuccess } from "@/lib/payment/handle-charge-success"
import { validatePaystackSignature } from "@/lib/payment/validate-paystack-signature"
import { after } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const isPaystackSignatureValid = validatePaystackSignature(
    body,
    req.headers.get("x-paystack-signature")
  )

  if (!isPaystackSignatureValid) {
    return Response.json({ success: false }, { status: 401 })
  }

  // Return 200 immediately per Paystack docs — long-running work triggers retries
  after(async () => {
    if (body.event === "charge.success") {
      await handleChargeSuccess(body.data)
    }
  })

  return Response.json({ success: true })
}
