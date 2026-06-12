import type { User } from "@/payload-types"
import type { FieldHook } from "payload"

export const ensureFirstUserIsAdmin: FieldHook<
  User,
  User["roles"],
  User
> = async ({ req, value }) => {
  if (value === undefined) {
    const { totalDocs } = await req.payload.find({
      collection: "users",
      limit: 1,
      depth: 0,
    })

    if (totalDocs === 0) {
      return ["admin"] as User["roles"]
    }
  }

  return (value ?? ["customer"]) as User["roles"]
}
