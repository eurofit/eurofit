import type { Access } from "payload"

import { checkRole } from "@/access/utils"

export const userOwned: Access = ({ req: { user } }) => {
  if (!user) return false
  if (checkRole(["admin"], user)) return true
  return { user: { equals: user.id } }
}
