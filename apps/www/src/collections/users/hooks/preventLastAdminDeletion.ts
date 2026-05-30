import type { CollectionBeforeDeleteHook } from "payload"
import { APIError } from "payload"

export const preventLastAdminDeletion: CollectionBeforeDeleteHook = async ({
  req,
  id,
}) => {
  const user = await req.payload.findByID({
    collection: "users",
    id: id as string,
  })

  if (user.roles?.includes("admin")) {
    const { totalDocs } = await req.payload.find({
      collection: "users",
      where: {
        and: [
          { id: { not_equals: id as string } },
          { roles: { contains: "admin" } },
        ],
      },
      limit: 1,
      depth: 0,
    })

    if (totalDocs === 0) {
      throw new APIError(
        "Cannot delete the last administrator. At least one admin must remain.",
        400
      )
    }
  }
}
