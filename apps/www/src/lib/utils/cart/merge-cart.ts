import "server-only"

import { readGuestSessionId } from "@/lib/utils/read-guest-session-id"
import config from "@payload-config"
import { getPayload } from "payload"

/**
 * Attaches the guest cart to the now-authenticated user. User cart wins: if the
 * user already has a cart, the guest cart is discarded; otherwise the guest cart
 * is handed over. Fire-and-forget — failures are swallowed, never surfaced.
 */
export async function mergeCart(userId: string) {
  try {
    const guestSessionId = await readGuestSessionId()
    if (!guestSessionId) return

    const payload = await getPayload({ config })

    const { docs: guestCarts } = await payload.find({
      collection: "carts",
      where: { guestSessionId: { equals: guestSessionId } },
      limit: 1,
      pagination: false,
    })
    const guestCart = guestCarts[0]
    if (!guestCart) return

    const { docs: userCarts } = await payload.find({
      collection: "carts",
      where: { user: { equals: userId } },
      limit: 1,
      pagination: false,
    })
    const hasUserCart = userCarts.length > 0

    if (hasUserCart) {
      // User cart wins — drop the guest cart.
      await payload.delete({ collection: "carts", id: guestCart.id })
      return
    }

    // No existing cart — hand the guest cart over to the user.
    await payload.update({
      collection: "carts",
      id: guestCart.id,
      data: { guestSessionId: null, user: userId },
    })
  } catch {
    // Merge is best-effort; never surface errors to the caller.
  }
}
