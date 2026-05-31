import type { CollectionBeforeLoginHook } from "payload"
import { APIError } from "payload"

import type { User } from "@/payload-types"

export const preventSuspendedLogin: CollectionBeforeLoginHook<User> = ({
  user,
}) => {
  if (user.isActive === false) {
    throw new APIError("Your account has been suspended.", 401)
  }
}
