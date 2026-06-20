"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { env } from "@/env.mjs"
import { captureError } from "@/lib/observability/capture-error"
import {
  UpdateProfile,
  updateProfileSchema,
} from "@/lib/schemas/account/update-profile"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { revalidatePath } from "next/cache"
import { getPayload } from "payload"

export async function updateProfile(
  unsafeData: UpdateProfile,
  turnstileToken: string
): Promise<ActionResult> {
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

  const parsed = updateProfileSchema.safeParse(unsafeData)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }

  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        code: 401,
        message: "You must be signed in to update your profile.",
      }
    }

    const payload = await getPayload({ config })

    await payload.update({
      collection: "users",
      id: user.id,
      data: parsed.data,
    })

    revalidatePath("/account")

    return { success: true, data: { ok: true } }
  } catch (error) {
    captureError(error, { scope: "account.update-profile" })
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again.",
    }
  }
}
