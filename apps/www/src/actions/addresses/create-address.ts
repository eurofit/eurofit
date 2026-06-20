"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { env } from "@/env.mjs"
import { captureError } from "@/lib/observability/capture-error"
import { Address, addressSchema } from "@/lib/schemas/addresses/address"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { Address as AddressDoc } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

export async function createAddress(
  unsafeAddress: Address,
  turnstileToken: string
): Promise<ActionResult<AddressDoc>> {
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

  const parsed = addressSchema.safeParse(unsafeAddress)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }

  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        code: 401,
        message: "You must be signed in to add an address.",
      }
    }

    const payload = await getPayload({ config })

    const address = await payload.create({
      collection: "addresses",
      data: { user: user.id, ...parsed.data },
      draft: false,
    })

    return { success: true, data: address }
  } catch (error) {
    captureError(error, { scope: "addresses.create" })
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    }
  }
}
