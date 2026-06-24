import "server-only"

import config from "@payload-config"
import { getPayload } from "payload"
import * as z from "zod"

export async function isValidResetToken(unSafeToken: string): Promise<boolean> {
  const parsed = z.string().safeParse(unSafeToken)
  if (!parsed.success) return false

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: "users",
      where: {
        and: [
          { resetPasswordToken: { equals: parsed.data } },
          {
            resetPasswordExpiration: { greater_than: new Date().toISOString() },
          },
        ],
      },
      limit: 1,
      pagination: false,
      overrideAccess: true,
    })

    return !!docs[0]
  } catch {
    return false
  }
}
