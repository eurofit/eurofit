"use server"

import { env } from "@/env.mjs"
import { SignupData, SignUpSchema } from "@/lib/schemas/auth/signup"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload, ValidationError } from "payload"

export async function signUp(
  unsafeData: SignupData,
  turnstileToken: string
): Promise<ActionResult<{ email: string }>> {
  const turnstileOk = await verifyTurnstile(
    turnstileToken,
    env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  )
  if (!turnstileOk) {
    return {
      success: false,
      code: 400,
      message: "CAPTCHA validation failed. Please try again.",
    }
  }

  const parsed = SignUpSchema.safeParse(unsafeData)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }
  const { confirmPassword: _, ...data } = parsed.data

  const payload = await getPayload({ config })

  try {
    const user = await payload.create({
      collection: "users",
      overrideAccess: true,
      data: { ...data, isActive: true, roles: ["customer"] },
      draft: false,
    })
    return { success: true, data: { email: user.email } }
  } catch (e) {
    if (e instanceof ValidationError) {
      const hasEmailConflict = e.data?.errors?.some(
        (err: { path: string }) => err.path === "email"
      )
      if (hasEmailConflict) {
        return { success: false, code: 409, message: "Email already exists" }
      }
    }
    console.error(e)
    return { success: false, code: 500, message: "Something went wrong!" }
  }
}
