import { env } from "@/env.mjs"
import config from "@payload-config"
import type { NextRequest } from "next/server"
import { getPayload } from "payload"

const INACTIVITY_WINDOW_DAYS = 14

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - INACTIVITY_WINDOW_DAYS)

    // Guest carts only: no owner (user exists false) AND a guest session id present.
    const { docs: deletedCarts } = await payload.delete({
      collection: "carts",
      where: {
        and: [
          { user: { exists: false } },
          { guestSessionId: { exists: true } },
          { lastActiveAt: { less_than: cutoff.toISOString() } },
        ],
      },
    })

    return Response.json({ success: true, deletedCount: deletedCarts.length })
  } catch (error) {
    console.error("[cron:abandoned-guest-carts] delete failed:", error)
    // Never surface internal errors to the caller.
    return Response.json({ success: false }, { status: 500 })
  }
}
