"use server"

import { site } from "@/const/site"
import { captureError, logger } from "@/lib/observability/capture-error"
import { resend } from "@/lib/resend"
import { ActionResult } from "@/types/action-result"
import payloadConfig from "@payload-config"
import { after } from "next/server"
import { getPayload } from "payload"
import { z } from "zod"

export async function verifyEmail(
  token: string
): Promise<ActionResult<{ verified: true }>> {
  try {
    const validToken = z.string().parse(token)
    const payload = await getPayload({ config: payloadConfig })

    // Capture the user before verifying — verifyEmail clears _verificationToken.
    const { docs } = await payload.find({
      collection: "users",
      where: { _verificationToken: { equals: validToken } },
      limit: 1,
      pagination: false,
      showHiddenFields: true,
      overrideAccess: true,
    })

    const user = docs[0] ?? null

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

    if (user) {
      // Fire-and-forget welcome email — best-effort, must not block or fail verification.
      after(() =>
        sendWelcomeEmail({
          email: user.email,
          firstName: user.firstName,
          siteUrl: site.url,
        })
      )
    }

    return { success: true, data: { verified: true } }
  } catch {
    // Invalid/expired verification token is an expected flow — warn, don't
    // capture, to avoid alert noise.
    logger.warn(
      "[verify-email] verification rejected — invalid or expired token"
    )
    return {
      success: false,
      code: 410,
      message: "This token is not valid or might be expired.",
    }
  }
}

type SendWelcomeEmailArgs = {
  email: string
  firstName: string
  siteUrl: string
}

async function sendWelcomeEmail({
  email,
  firstName,
  siteUrl,
}: SendWelcomeEmailArgs) {
  try {
    await resend.emails.send({
      to: [email],
      template: {
        id: "welcome",
        variables: {
          siteUrl,
          firstName,
        },
      },
    })
  } catch (error) {
    // Best-effort — never blocks verification, but capture so failed welcome
    // emails are still visible.
    captureError(error, { scope: "auth.welcome-email" })
  }
}
