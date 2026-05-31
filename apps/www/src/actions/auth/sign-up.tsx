"use server"

import { SignupData, SignUpSchema } from "@/components/forms/signup/schema"
import config from "@/payload.config"
import { getPayload } from "payload"

export async function signUp(unsafeData: SignupData) {
  const data = SignUpSchema.parse(unsafeData)

  const payload = await getPayload({ config })

  try {
    const user = await payload.create({
      collection: "users",
      data: { ...data, paystackCustomerCode: "N/A" },
      draft: false,
    })
    return { email: user.email }
  } catch (error: unknown) {
    throw new Error("Failed to create user")
  }
}
