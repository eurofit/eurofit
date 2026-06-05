"use server"

import { ActionResult } from "@/types/action-result"
import payloadConfig from "@payload-config"
import { getPayload } from "payload"
import { z } from "zod"

export async function verifyEmail(
  token: string
): Promise<ActionResult<{ verified: true }>> {
  try {
    const validToken = z.string().parse(token)
    const payload = await getPayload({ config: payloadConfig })

    const isVerified = await payload.verifyEmail({
      collection: "users",
      token: validToken,
    })

    if (!isVerified) {
      return {
        success: false,
        code: 410,
        message: "This token is not valid or might be expired.",
      }
    }

    return { success: true, data: { verified: true } }
  } catch {
    return {
      success: false,
      code: 410,
      message: "This token is not valid or might be expired.",
    }
  }
}
