"use server"

import { site } from "@/const/site"
import { ActionResult } from "@/types/action-result"
import {
  generateWelcomeEmailHTML,
  generateWelcomeEmailText,
} from "@eurofit/transactional/welcome"
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
      after(async () => {
        try {
          const [html, text] = await Promise.all([
            generateWelcomeEmailHTML({
              baseUrl: site.url,
              firstName: user.firstName,
            }),
            generateWelcomeEmailText({
              baseUrl: site.url,
              firstName: user.firstName,
            }),
          ])

          await payload.sendEmail({
            to: user.email,
            subject: "Welcome to Eurofit",
            html,
            text,
            replyTo: "info@eurofit.co.ke",
          })
        } catch {
          // Swallow — the welcome email is best-effort.
        }
      })
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
