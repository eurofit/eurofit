"use server"

import { env } from "@/env.mjs"
import { captureError } from "@/lib/observability/capture-error"
import {
  ForgotPasswordData,
  forgotPasswordSchema,
} from "@/lib/schemas/auth/forgot-password"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

export async function forgotPassword(
  unSafeData: ForgotPasswordData,
  turnstileToken: string
): Promise<ActionResult<{ email: string }>> {
  const turnstileOk = await verifyTurnstile(
    turnstileToken,
    env.CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY
  )
  if (!turnstileOk) {
    return {
      success: false,
      code: 400,
      message: "CAPTCHA validation failed. Please try again.",
    }
  }

  const parsed = forgotPasswordSchema.safeParse(unSafeData)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }
  const { email } = parsed.data

  const payload = await getPayload({ config })

  try {
    await payload.forgotPassword({
      collection: "users",
      data: { email },
    })
    return { success: true, data: { email } }
  } catch (error) {
    captureError(error, { scope: "auth.forgot-password" })
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again.",
    }
  }
}
