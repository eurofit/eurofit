"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { AddressId, addressIdSchema } from "@/lib/schemas/addresses/address"
import { Address as AddressDoc } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"

export async function setDefaultAddress(
  unsafeId: AddressId
): Promise<ActionResult<AddressDoc>> {
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
        message: "You must be signed in to set a default address.",
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

    const updated = await payload.update({
      collection: "addresses",
      id,
      data: { isDefault: true },
    })

    return { success: true, data: updated }
  } catch {
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    }
  }
}
