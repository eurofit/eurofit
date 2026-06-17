import { handleChargeSuccess } from "@/lib/payment/handle-charge-success"
import { validatePaystackSignature } from "@/lib/payment/validate-paystack-signature"
import { after } from "next/server"

export async function POST(req: Request) {
  let body: { event?: string; data?: { reference?: string } }

  try {
    body = await req.json()
  } catch (error) {
    console.error("[paystack-webhook] failed to parse request body:", error)
    return Response.json({ success: false }, { status: 400 })
  }

  console.log(
    "[paystack-webhook] received event:",
    body.event,
    "reference:",
    body.data?.reference
  )

  const isPaystackSignatureValid = validatePaystackSignature(
    body,
    req.headers.get("x-paystack-signature")
  )

  if (!isPaystackSignatureValid) {
    console.log(
      "[paystack-webhook] rejecting event — invalid signature, reference:",
      body.data?.reference
    )
    return Response.json({ success: false }, { status: 401 })
  }

  console.log(
    "[paystack-webhook] signature valid — dispatching, reference:",
    body.data?.reference
  )

  // Return 200 immediately per Paystack docs — long-running work triggers retries
  after(async () => {
    if (body.event === "charge.success") {
      console.log(
        "[paystack-webhook] handling charge.success, reference:",
        body.data?.reference
      )
      try {
        await handleChargeSuccess(body.data as { reference: string })
      } catch (error) {
        // TODO: implement error tracking service (see TODOS.md)
        console.error(
          "[paystack-webhook] handleChargeSuccess failed, reference:",
          body.data?.reference,
          error
        )
      }
      return
    }

    console.log("[paystack-webhook] ignoring unhandled event:", body.event)
  })

  return Response.json({ success: true })
}
