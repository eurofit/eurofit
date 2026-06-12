import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { activeField } from "@/fields/active"
import type { CollectionConfig } from "payload"
import { slugField } from "payload"
import {
  revalidatePackagesTag,
  revalidatePackagesTagOnDelete,
} from "./hooks/revalidate-tag"

export const packages: CollectionConfig = {
  slug: "packages",
  typescript: {
    interface: "Package",
  },
  labels: {
    singular: "Package",
    plural: "Packages",
  },
  access: {
    create: adminOnly,
    read: everyone,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  admin: {
    description:
      "Shipping package tiers with their physical dimensions and weight limits.",
    useAsTitle: "title",
    listSearchableFields: ["id", "title", "slug"],
    defaultColumns: ["title", "isActive"],
  },
  defaultPopulate: {
    slug: true,
    title: true,
    isActive: true,
    length: true,
    width: true,
    height: true,
    maxWeight: true,
  },
  defaultSort: "title",
  fields: [
    slugField(),
    activeField(),
    {
      name: "title",
      type: "text",
      label: "Package Name",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'The name of the package tier, e.g. "Small package".',
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "length",
          type: "number",
          label: "Length (cm)",
          required: true,
          min: 0,
        },
        {
          name: "width",
          type: "number",
          label: "Width (cm)",
          required: true,
          min: 0,
        },
        {
          name: "height",
          type: "number",
          label: "Height (cm)",
          required: true,
          min: 0,
        },
        {
          name: "maxWeight",
          type: "number",
          label: "Max Weight (Kg)",
          required: true,
          min: 0,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePackagesTag],
    afterDelete: [revalidatePackagesTagOnDelete],
  },
}
