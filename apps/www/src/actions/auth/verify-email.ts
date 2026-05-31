"use server"

import payloadConfig from "@/payload.config"
import { getPayload } from "payload"
import { z } from "zod"

export async function verifyEmail(token: string): Promise<boolean> {
  const validToken = z.string().parse(token)

  const payload = await getPayload({ config: payloadConfig })

  const isVerified = await payload.verifyEmail({
    collection: "users",
    token: validToken,
  })

  if (!isVerified) {
    throw new Error("This token is not valid or might be expired")
  }

  return isVerified
}
