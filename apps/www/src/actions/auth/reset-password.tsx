"use server"

import { env } from "@/env.mjs"
import { logger } from "@/lib/observability/capture-error"
import {
  ResetPasswordData,
  resetPasswordSchema,
} from "@/lib/schemas/auth/reset-password"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

export async function resetPassword(
  args: ResetPasswordData,
  turnstileToken: string
): Promise<ActionResult> {
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

  const parsed = resetPasswordSchema.safeParse(args)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }
  const { password, token } = parsed.data
  const payload = await getPayload({ config })

  try {
    await payload.resetPassword({
      collection: "users",
      data: { password, token },
      overrideAccess: true,
    })
    return { success: true, data: { ok: true } }
  } catch {
    // Expired/invalid token is an expected user flow — log as a warning rather
    // than capturing it as an exception so it doesn't create alert noise.
    logger.warn("[reset-password] reset rejected — invalid or expired token")
    return {
      success: false,
      code: 410,
      message: "Token is invalid or has expired.",
    }
  }
}
