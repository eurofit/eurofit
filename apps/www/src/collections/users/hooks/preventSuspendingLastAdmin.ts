import type { FieldHook } from "payload"
import { APIError } from "payload"
import type { User } from "@/payload-types"

export const preventSuspendingLastAdmin: FieldHook<
  User,
  User["isSuspended"],
  User
> = async ({ req, value, siblingData }) => {
  if (value === true && siblingData?.roles?.includes("admin")) {
    const { totalDocs } = await req.payload.find({
      collection: "users",
      where: {
        and: [
          { id: { not_equals: siblingData.id } },
          { roles: { contains: "admin" } },
        ],
      },
      limit: 1,
      depth: 0,
    })

    if (totalDocs === 0) {
      throw new APIError(
        "Cannot suspend the last administrator. At least one admin must remain.",
        400
      )
    }
  }

  return (value ?? false) as User["isSuspended"]
}
