import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { CollectionConfig, slugField } from "payload"
import { revalidateCategoriesTag } from "./hooks/revalidate-categories-tag"

export const categories: CollectionConfig = {
  slug: "categories",
  typescript: {
    interface: "Category",
  },
  labels: {
    singular: "Category",
    plural: "Categories",
  },
  access: {
    create: adminOnly,
    read: everyone,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title"],
  },
  defaultSort: "title",
  defaultPopulate: {
    title: true,
    slug: true,
  },
  fields: [
    slugField(),
    {
      name: "title",
      type: "text",
      required: true,
      label: "Category Name",
      admin: {
        description: "Enter the name of the category.",
      },
    },
    {
      name: "type",
      label: "Category Type",
      type: "select",
      options: [
        {
          label: "Product",
          value: "product",
        },
        {
          label: "Post",
          value: "post",
        },
      ],
      defaultValue: "product",
      hasMany: true,
      access: {
        create: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      admin: {
        description: "Provide a brief description of the category.",
      },
    },

    {
      name: "srcUrl",
      type: "text",
      label: "Source URL",
      admin: {
        description:
          "This is the URL of the supplier's page for this category.",
      },
      access: {
        create: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
    },
    {
      name: "active",
      type: "checkbox",
      label: "Active",
      defaultValue: true,
      admin: {
        description: "Indicates whether the category is currently active.",
        position: "sidebar",
      },
      access: {
        create: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCategoriesTag],
  },
}
