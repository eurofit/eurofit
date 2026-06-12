import { adminOnly } from "@/access/admin"
import { adminOnlyFieldAccess } from "@/access/admin-field"
import { everyone } from "@/access/everyone"
import { GlobalConfig } from "payload"
import { revalidateFooterTag } from "./hooks/revalidate-footer-tag"

export const footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: everyone,
    update: adminOnly,
  },
  fields: [
    {
      name: "tagline",
      label: "Tagline",
      type: "text",
      required: true,
      access: {
        read: everyone,
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "nav",
      label: "Navigation",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "links",
          type: "array",
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
        },
      ],
      required: true,
      access: {
        read: everyone,
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooterTag],
  },
}
