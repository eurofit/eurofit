import type { FieldHook } from "payload"
import { APIError } from "payload"

import type { User } from "@/payload-types"

export const preventDeactivatingLastAdmin: FieldHook<
  User,
  User["isActive"],
  User
> = async ({ req, value, siblingData }) => {
  if (value === false && siblingData?.roles?.includes("admin")) {
    const { totalDocs } = await req.payload.find({
      collection: "users",
      where: {
        and: [
          { id: { not_equals: siblingData.id } },
          { roles: { contains: "admin" } },
          { isActive: { equals: true } },
        ],
      },
      limit: 1,
      depth: 0,
      req,
    })

    if (totalDocs === 0) {
      throw new APIError(
        "Cannot deactivate the last administrator. At least one active admin must remain.",
        400
      )
    }
  }

  return (value ?? true) as User["isActive"]
}
