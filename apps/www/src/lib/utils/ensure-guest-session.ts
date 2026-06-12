import { GUEST_SESSION_LIFETIME } from "@/const/guest-session"
import { COOKIE_KEYS } from "@/const/keys"
import { NextRequest, NextResponse } from "next/server"
import { ensureUuid } from "./ensure-uuid"

export function ensureGuestSession(req: NextRequest, res: NextResponse): void {
  const sessionId = req.cookies.get(COOKIE_KEYS.GUEST_SESSION_ID)?.value
  const guestSessionId = ensureUuid(sessionId)

  res.cookies.set(COOKIE_KEYS.GUEST_SESSION_ID, guestSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: GUEST_SESSION_LIFETIME,
    path: "/",
  })
}
