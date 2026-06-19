import { Discount } from "@/payload-types"
import { APIError, CollectionBeforeChangeHook } from "payload"

export const addStaff: CollectionBeforeChangeHook<Discount> = async ({
  req,
  operation,
  data,
}) => {
  if (operation === "update") return

  const user = req.user

  if (!user) {
    throw new APIError("Staff must be authenticated to create a discount")
  }

  return {
    ...data,
    staff: typeof user === "string" ? user : user.id,
  }
}
