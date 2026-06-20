"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { env } from "@/env.mjs"
import { captureError } from "@/lib/observability/capture-error"
import {
  AddressWithId,
  addressWithIdSchema,
} from "@/lib/schemas/addresses/address"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { Address as AddressDoc } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

export async function updateAddress(
  unsafeAddress: AddressWithId,
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

  const parsed = addressWithIdSchema.safeParse(unsafeAddress)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }

  const { id, ...address } = parsed.data

  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        code: 401,
        message: "You must be signed in to update an address.",
      }
    }

    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: "addresses",
      where: { id: { equals: id }, user: { equals: user.id } },
      limit: 1,
      pagination: false,
      depth: 0,
    })
    if (!docs[0]) {
      return { success: false, code: 404, message: "Address not found." }
    }

    const updated = await payload.update({
      collection: "addresses",
      id,
      data: address,
    })

    return { success: true, data: updated }
  } catch (error) {
    captureError(error, { scope: "addresses.update" })
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    }
  }
}
