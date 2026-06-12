import { ensureGuestSession } from "@/lib/utils/ensure-guest-session"
import { type NextRequest, NextResponse } from "next/server"

export function proxy(req: NextRequest) {
  const res = NextResponse.next()

  ensureGuestSession(req, res)

  return res
}

export const config = {
  matcher: ["/((?!api|admin|_next/static|_next/image|.*\\.png$).*)"],
}
