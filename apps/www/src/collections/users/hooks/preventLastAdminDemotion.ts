import type { FieldHook } from "payload"
import { APIError } from "payload"
import type { User } from "@/payload-types"

export const preventLastAdminDemotion: FieldHook<
  User,
  User["roles"],
  User
> = async ({ req, value }) => {
  if (value?.includes("admin")) {
    const { totalDocs } = await req.payload.find({
      collection: "users",
      where: {
        roles: { contains: "admin" },
      },
      limit: 1,
      depth: 0,
    })

    if (totalDocs === 1) {
      throw new APIError(
        "Cannot demote the last administrator. At least one admin must remain.",
        400
      )
    }
  }

  return (value ?? []) as User["roles"]
}
