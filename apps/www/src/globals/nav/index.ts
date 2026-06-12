import { adminOnly } from "@/access/admin"
import { adminOnlyFieldAccess } from "@/access/admin-field"
import { everyone } from "@/access/everyone"
import { GlobalConfig } from "payload"
import { revalidateNavTag } from "./hooks/revalidate-nav-tag"

export const nav: GlobalConfig = {
  slug: "nav",
  access: {
    read: everyone,
    update: adminOnly,
  },
  fields: [
    {
      name: "items",
      label: "Menu Items",
      type: "array",
      required: true,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
      access: {
        read: everyone,
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateNavTag],
  },
}
