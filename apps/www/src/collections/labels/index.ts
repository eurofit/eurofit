import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { activeField } from "@/fields/active"
import { iconField } from "@/fields/icon"
import { CollectionConfig } from "payload"

export const labels: CollectionConfig = {
  slug: "labels",
  typescript: { interface: "Label" },
  labels: { singular: "Label", plural: "Labels" },
  access: {
    create: adminOnly,
    read: everyone,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "icon", "isActive"],
  },
  defaultSort: "title",
  fields: [
    activeField(),
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    iconField(),
    {
      type: "row",
      fields: [
        {
          name: "fg",
          label: "Foreground Color",
          type: "text",
          admin: {
            description: "Text/icon color, e.g. #ffffff or hsl(0 0% 100%)",
          },
        },
        {
          name: "bg",
          label: "Background Color",
          type: "text",
          admin: {
            description:
              "Badge background color, e.g. #ef4444 or hsl(0 84% 60%)",
          },
        },
      ],
    },
    {
      name: "productVariants",
      label: "Product Variants",
      type: "relationship",
      relationTo: "product-variants",
      hasMany: true,
    },
  ],
}
