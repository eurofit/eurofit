"use server"

import config from "@/payload.config"
import { LoginData, loginSchema } from "@/schemas/login"
import { safeUserSchema } from "@/schemas/safe-user"
import { login as payloadLogin } from "@payloadcms/next/auth"
import { AuthenticationError, UnverifiedEmail } from "payload"

export async function login(unSafeData: LoginData) {
  const { email, password } = loginSchema.parse(unSafeData)

  try {
    const result = await payloadLogin({
      collection: "users",
      config,
      email,
      password,
    })

    if (!result.user) {
      throw new Error("Login failed")
    }

    const res = {
      user: safeUserSchema.parse({
        ...result.user,
        isVerified: result.user._verified ?? false,
        addresses:
          result.user.addresses?.docs
            ?.filter((a) => typeof a !== "string")
            .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)) ??
          [],
      }),
    }

    return res
  } catch (error: unknown) {
    if (error instanceof AuthenticationError) {
      throw new Error("Invalid email or password.")
    }
    if (error instanceof UnverifiedEmail) {
      throw new Error("Please verify your email to login.")
    }

    throw new Error("Something went wrong. Please try again later.")
  }
}

export type LoginResult = Awaited<ReturnType<typeof login>>
