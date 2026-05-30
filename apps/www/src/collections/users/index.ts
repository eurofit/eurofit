import { CollectionConfig } from "payload"
import { userRoles } from "@/const/user-roles"
import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin"
import { preventLastAdminDemotion } from "./hooks/preventLastAdminDemotion"
import { preventLastAdminDeletion } from "./hooks/preventLastAdminDeletion"
import { preventSuspendingLastAdmin } from "./hooks/preventSuspendingLastAdmin"

export const users: CollectionConfig = {
  slug: "users",
  auth: true,
  hooks: {
    beforeChange: [preventLastAdminDemotion],
    beforeDelete: [preventLastAdminDeletion],
  },
  fields: [
    {
      type: "select",
      name: "roles",
      label: "Roles",
      options: userRoles,
      hasMany: true,
      required: true,
      defaultValue: ["customer"],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      admin: {
        position: "sidebar",
      },
    },
    {
      type: "checkbox",
      name: "isSuspended",
      label: "Suspend User",
      required: true,
      defaultValue: false,
      hooks: {
        beforeChange: [preventSuspendingLastAdmin],
      },
      admin: {
        position: "sidebar",
      },
    },
  ],
}
