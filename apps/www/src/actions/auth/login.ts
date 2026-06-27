"use server"

import { COOKIE_KEYS } from "@/const/keys"
import { env } from "@/env.mjs"
import { captureError } from "@/lib/observability/capture-error"
import { LoginData, loginSchema } from "@/lib/schemas/auth/login"
import { mergeCart } from "@/lib/utils/cart/merge-cart"
import { readGuestSessionId } from "@/lib/utils/read-guest-session-id"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { User } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { login as payloadLogin } from "@payloadcms/next/auth"
import { cookies } from "next/headers"
import { after } from "next/server"
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

    const user = result.user

    if (!user) {
      return {
        success: false,
        code: 401,
        message: "Login failed.",
      }
    }

    // Signal the cart-merge toast before the response is sent (after() cannot set cookies).
    const guestSessionId = await readGuestSessionId()
    if (guestSessionId) {
      const cookieStore = await cookies()
      cookieStore.set(COOKIE_KEYS.CART_MERGE_NOTICE, "1", {
        maxAge: 60 * 5,
        httpOnly: false,
        sameSite: "lax",
        path: "/",
      })
    }

    // merge the guest cart into the user account without blocking the response
    after(() => mergeCart(user.id))

    return { success: true, data: { user } } as const
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

    // Only unexpected errors reach here — the typed auth failures above are
    // normal user flows and must not be captured.
    captureError(error, { scope: "auth.login" })
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    } satisfies ActionResult
  }
}

export type LoginResult = Awaited<ReturnType<typeof login>>
