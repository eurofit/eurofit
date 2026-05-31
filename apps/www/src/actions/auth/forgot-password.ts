"use server"

import config from "@/payload.config"
import { isEmpty } from "lodash-es"
import { getPayload } from "payload"
import * as z from "zod"

const emailSchema = z.object({
  email: z.email("Invalid email address"),
})

type EmailData = z.infer<typeof emailSchema>

export async function forgotPassword(unSafeData: EmailData) {
  const { email } = emailSchema.parse(unSafeData)

  const payload = await getPayload({ config })

  const token = await payload.forgotPassword({
    collection: "users",
    data: {
      email,
    },
  })

  if (isEmpty(token)) {
    throw new Error("User not found")
  }

  return { email }
}
