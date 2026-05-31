import type { Access } from "payload"

import { checkRole } from "@/access/utils"

export const adminOnly: Access = ({ req: { user } }) => {
  if (!user) return false

  return checkRole(["admin"], user)
}
