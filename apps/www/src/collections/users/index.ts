import { adminOnly } from "@/access/admin"
import { adminOnlyFieldAccess } from "@/access/admin-field"
import { adminOrSelf } from "@/access/admin-or-self"
import { isAdmin } from "@/access/is-admin"
import { userRoles } from "@/const/user-roles"
import { activeField } from "@/fields/active"
import { CollectionConfig } from "payload"
import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin"
import { preventSuspendedLogin } from "./hooks/prevent-suspended-login"
import { preventDeactivatingLastAdmin } from "./hooks/preventDeactivatingLastAdmin"
import { preventLastAdminDeletion } from "./hooks/preventLastAdminDeletion"
import { preventLastAdminDemotion } from "./hooks/preventLastAdminDemotion"

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
    beforeLogin: [preventSuspendedLogin],
    beforeChange: [preventLastAdminDemotion],
    beforeDelete: [preventLastAdminDeletion],
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "roles", "isActive"],
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
    activeField({
      saveToJWT: true,
      hooks: {
        beforeChange: [preventDeactivatingLastAdmin],
      },
    }),
  ],
}
