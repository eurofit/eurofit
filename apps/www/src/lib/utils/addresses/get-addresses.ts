import "server-only"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { captureError } from "@/lib/observability/capture-error"
import { Address } from "@/payload-types"
import config from "@payload-config"
import { getPayload } from "payload"

export async function getAddresses(): Promise<Address[]> {
  const user = await getCurrentUser()
  if (!user) return []

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: "addresses",
      where: { user: { equals: user.id } },
      sort: "-isDefault,-createdAt",
      limit: 20,
      depth: 0,
    })

    return docs
  } catch (error) {
    captureError(error, { scope: "addresses.get" })
    return []
  }
}
