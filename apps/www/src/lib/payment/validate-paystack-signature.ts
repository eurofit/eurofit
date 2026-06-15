import { env } from "@/env.mjs"
import crypto from "node:crypto"

export function validatePaystackSignature(
  body: unknown,
  signature: string | null
): boolean {
  if (!signature) return false
  const hash = crypto
    .createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest("hex")
  return hash === signature
}
