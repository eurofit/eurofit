import type { PayloadRequest } from "payload"

import { checkRole } from "@/access/utils"

type AtomicAccess =
  | (({ req }: { req: PayloadRequest }) => boolean | Promise<boolean>)
  | undefined

/**
 * Atomic access checker that verifies if the user has the admin role.
 *
 * @returns true if user is an admin, false otherwise
 */
export const isAdmin: AtomicAccess = ({ req }) => {
  if (!req.user) return false

  return checkRole(["admin"], req.user)
}
