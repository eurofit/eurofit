import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { CollectionConfig } from "payload"

export const media: CollectionConfig = {
  slug: "media",
  access: {
    create: adminOnly,
    read: everyone,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  upload: {
    disableLocalStorage: true,
    pasteURL: {
      allowList: [
        {
          hostname: "www.tropicanawholesale.com",
        },
      ],
    },
  },
  admin: {
    defaultColumns: ["filename", "alt", "size", "createdAt"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
      admin: {
        description:
          "Alternative text for the media, used for accessibility and SEO.",
      },
    },
    {
      name: "tags",
      type: "text",
      label: "Tags",
      admin: {
        description: "Tags for the media, used for categorization and search.",
      },
      hasMany: true,
    },
  ],
}
