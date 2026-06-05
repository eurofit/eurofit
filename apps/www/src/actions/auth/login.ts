"use server"

import { env } from "@/env.mjs"
import { LoginData, loginSchema } from "@/lib/schemas/auth/login"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { User } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { login as payloadLogin } from "@payloadcms/next/auth"
import { APIError, AuthenticationError, UnverifiedEmail } from "payload"

export async function login(
  unSafeData: LoginData,
  turnstileToken: string
): Promise<ActionResult<{ user: User }>> {
  const turnstileOk = await verifyTurnstile(
    turnstileToken,
    env.CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY
  )
  if (!turnstileOk) {
    return {
      success: false,
      code: 400,
      message: "CAPTCHA validation failed. Please try again.",
    } satisfies ActionResult
  }

  const parsed = loginSchema.safeParse(unSafeData)
  if (!parsed.success) {
    return {
      success: false,
      code: 400,
      message: "Invalid input.",
    } satisfies ActionResult
  }
  const { email, password } = parsed.data

  try {
    const result = await payloadLogin({
      collection: "users",
      config,
      email,
      password,
    })

    if (!result.user) {
      return {
        success: false,
        code: 401,
        message: "Login failed.",
      } satisfies ActionResult
    }

    return { success: true, data: { user: result.user } } as const
  } catch (error: unknown) {
    if (error instanceof AuthenticationError) {
      return {
        success: false,
        code: 401,
        message: "Invalid email or password.",
      } satisfies ActionResult
    }

    if (error instanceof UnverifiedEmail) {
      return {
        success: false,
        code: 403,
        message: "Please verify your email to login.",
      } satisfies ActionResult
    }

    if (error instanceof APIError) {
      return {
        success: false,
        code: error.status ?? 403,
        message: error.isPublic
          ? error.message
          : "Something went wrong. Please try again later.",
      } satisfies ActionResult
    }

    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    } satisfies ActionResult
  }
}

export type LoginResult = Awaited<ReturnType<typeof login>>
