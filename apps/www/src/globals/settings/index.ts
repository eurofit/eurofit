import type { GlobalConfig } from "payload"

import { adminOnly } from "@/access/admin"
import { adminOnlyFieldAccess } from "@/access/admin-field"
import { everyone } from "@/access/everyone"

export const Settings: GlobalConfig = {
  slug: "settings",
  access: {
    read: everyone,
    update: adminOnly,
  },
  fields: [
    {
      name: "areas",
      label: "Service Areas",
      type: "text",
      hasMany: true,
      access: {
        read: everyone,
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
  ],
}
