import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { activeField } from "@/fields/active"
import type { CollectionConfig } from "payload"
import { slugField } from "payload"
import { revalidateServiceAreasTag } from "./hooks/revalidate-service-areas-tag"

export const serviceAreas: CollectionConfig = {
  slug: "service-areas",
  typescript: {
    interface: "ServiceArea",
  },
  labels: {
    singular: "Service Area",
    plural: "Service Areas",
  },
  access: {
    create: adminOnly,
    read: everyone,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  admin: {
    description: "Geographic areas the store serves.",
    useAsTitle: "title",
    listSearchableFields: ["id", "title", "slug"],
    defaultColumns: ["title", "slug", "isActive"],
  },
  defaultPopulate: {
    slug: true,
    title: true,
    isActive: true,
  },
  defaultSort: "title",
  fields: [
    slugField(),
    activeField(),
    {
      name: "title",
      type: "text",
      label: "Area Name",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "The name of the service area.",
      },
    },
  ],
  hooks: {
    afterChange: [revalidateServiceAreasTag],
  },
}
