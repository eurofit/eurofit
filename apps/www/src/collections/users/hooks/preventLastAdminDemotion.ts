import type { User } from "@/payload-types"
import type { CollectionBeforeChangeHook } from "payload"
import { APIError } from "payload"

export const preventLastAdminDemotion: CollectionBeforeChangeHook<
  User
> = async ({ req, data, originalDoc }) => {
  if (originalDoc?.roles?.includes("admin") && !data.roles?.includes("admin")) {
    const { totalDocs } = await req.payload.find({
      collection: "users",
      where: {
        and: [
          { id: { not_equals: originalDoc.id } },
          { roles: { contains: "admin" } },
        ],
      },
      limit: 1,
      depth: 0,
    })

    if (totalDocs === 0) {
      throw new APIError(
        "Cannot demote the last administrator. At least one admin must remain.",
        400
      )
    }
  }

  return data
}
