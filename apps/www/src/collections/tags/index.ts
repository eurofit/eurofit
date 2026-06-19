import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { activeField } from "@/fields/active"
import { CollectionConfig } from "payload"

const TAG_TYPES = [
  { label: "Product", value: "product" },
  { label: "Product Variant", value: "product-variant" },
  { label: "User", value: "user" },
]

export const tags: CollectionConfig = {
  slug: "tags",
  typescript: { interface: "Tag" },
  labels: { singular: "Tag", plural: "Tags" },
  access: {
    create: adminOnly,
    read: everyone,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "isActive"],
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
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
    {
      name: "type",
      type: "select",
      options: TAG_TYPES,
      required: true,
      defaultValue: "product",
    },
    {
      name: "products",
      label: "Products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      admin: {
        condition: (data) => data?.type === "product",
      },
    },
    {
      name: "productVariants",
      label: "Product Variants",
      type: "relationship",
      relationTo: "product-variants",
      hasMany: true,
      admin: {
        condition: (data) => data?.type === "product-variant",
      },
    },
    {
      name: "users",
      label: "Users",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      admin: {
        condition: (data) => data?.type === "user",
      },
    },
  ],
}
