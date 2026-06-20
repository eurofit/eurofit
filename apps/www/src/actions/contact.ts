"use server"

import { env } from "@/env.mjs"
import { captureError } from "@/lib/observability/capture-error"
import { ContactData, contactSchema } from "@/lib/schemas/contact/contact"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

export async function submitContactForm(
  unsafeData: ContactData,
  turnstileToken: string
): Promise<ActionResult<{ ok: true }>> {
  const isTurnstileValid = await verifyTurnstile(
    turnstileToken,
    env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  )
  if (!isTurnstileValid) {
    return {
      success: false,
      code: 400,
      message: "CAPTCHA validation failed. Please try again.",
    }
  }

  const parsed = contactSchema.safeParse(unsafeData)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }
  const data = parsed.data

  const payload = await getPayload({ config })

  try {
    const {
      docs: [form],
    } = await payload.find({
      collection: "forms",
      where: {
        title: {
          equals: "Contact us",
        },
      },
      limit: 1,
      pagination: false,
    })

    if (!form) {
      return {
        success: false,
        code: 500,
        message: "Something went wrong. Please try again later.",
      }
    }

    await payload.create({
      collection: "form-submissions",
      data: {
        form: form.id,
        submissionData: Object.entries(data).map(([field, value]) => ({
          field,
          value: value.toString(),
        })),
      },
    })

    return { success: true, data: { ok: true } }
  } catch (e) {
    captureError(e, { scope: "contact" })
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    }
  }
}
