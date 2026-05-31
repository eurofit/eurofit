"use server"

import config from "@/payload.config"
import {
  ResetPasswordData,
  resetPasswordSchema,
} from "@/schemas/reset-password"
import { isEmpty } from "lodash-es"
import { getPayload } from "payload"

export async function resetPassword(args: ResetPasswordData) {
  const { password, token } = resetPasswordSchema.parse(args)
  const payload = await getPayload({
    config,
  })

  try {
    const result = await payload.resetPassword({
      collection: "users",
      data: {
        password,
        token,
      },
      overrideAccess: true,
    })

    return !isEmpty(result)
  } catch (error: unknown) {
    return false
  }
}
