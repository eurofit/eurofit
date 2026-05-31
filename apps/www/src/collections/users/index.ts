import { adminOnly } from "@/access/admin"
import { adminOnlyFieldAccess } from "@/access/admin-field"
import { adminOrSelf } from "@/access/admin-or-self"
import { isAdmin } from "@/access/is-admin"
import { userRoles } from "@/const/user-roles"
import { CollectionConfig } from "payload"
import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin"
import { preventLastAdminDeletion } from "./hooks/preventLastAdminDeletion"
import { preventLastAdminDemotion } from "./hooks/preventLastAdminDemotion"
import { preventSuspendingLastAdmin } from "./hooks/preventSuspendingLastAdmin"

export const users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: {
    create: adminOrSelf,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: adminOnly,
    admin: isAdmin,
  },
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
      saveToJWT: true,
      admin: {
        position: "sidebar",
      },
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
    },
    {
      type: "checkbox",
      name: "isSuspended",
      label: "Suspend User",
      required: true,
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      hooks: {
        beforeChange: [preventSuspendingLastAdmin],
      },
    },
  ],
}
