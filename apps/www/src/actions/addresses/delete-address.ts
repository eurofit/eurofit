"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { AddressId, addressIdSchema } from "@/lib/schemas/addresses/address"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

export async function deleteAddress(
  unsafeId: AddressId
): Promise<ActionResult<{ id: string }>> {
  const parsed = addressIdSchema.safeParse(unsafeId)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }

  const { id } = parsed.data

  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        code: 401,
        message: "You must be signed in to delete an address.",
      }
    }

    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: "addresses",
      where: { id: { equals: id }, user: { equals: user.id } },
      limit: 1,
      pagination: false,
      depth: 0,
    })
    if (!docs[0]) {
      return { success: false, code: 404, message: "Address not found." }
    }

    await payload.delete({ collection: "addresses", id, depth: 0 })

    return { success: true, data: { id } }
  } catch {
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    }
  }
}
