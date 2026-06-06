"use server"

import { site } from "@/const/site"
import { env } from "@/env.mjs"
import {
  ResendVerificationData,
  resendVerificationSchema,
} from "@/lib/schemas/auth/resend-verification"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { ActionResult } from "@/types/action-result"
import { generateVerificationEmailHTML } from "@eurofit/transactional/verification"
import config from "@payload-config"
import { getPayload } from "payload"
import { v4 as uuidv4 } from "uuid"

export async function resendVerificationEmailByEmail(
  unsafeData: ResendVerificationData,
  turnstileToken: string
): Promise<ActionResult<{ status: "sent" }>> {
  const isTurnstileValid = await verifyTurnstile(
    turnstileToken,
    env.CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY
  )
  if (!isTurnstileValid) {
    return {
      success: false,
      code: 400,
      message: "CAPTCHA validation failed. Please try again.",
    }
  }

  const validationRes = resendVerificationSchema.safeParse(unsafeData)

  if (!validationRes.success) {
    return {
      success: false,
      code: 400,
      message: "Invalid email address.",
    }
  }

  const { email } = validationRes.data

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
      pagination: false,
      showHiddenFields: true,
      overrideAccess: true,
    })

    const user = docs[0] ?? null

    // Anti-enumeration: treat not-found and already-verified the same as sent
    if (!user || user._verified === true) {
      return { success: true, data: { status: "sent" } }
    }

    const newToken = uuidv4()

    await payload.update({
      collection: "users",
      id: user.id,
      data: { _verificationToken: newToken },
      overrideAccess: true,
    })

    const html = await generateVerificationEmailHTML({
      baseUrl: site.url,
      token: newToken,
      firstName: user.firstName ?? undefined,
    })

    await payload.sendEmail({
      to: email,
      subject: "Verify your email",
      html,
    })

    return { success: true, data: { status: "sent" } }
  } catch {
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again.",
    }
  }
}
