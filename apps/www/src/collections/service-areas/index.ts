import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { activeField } from "@/fields/active"
import type { CollectionConfig, NumberFieldValidation } from "payload"
import { slugField } from "payload"
import {
  revalidateServiceAreasTag,
  revalidateServiceAreasTagOnDelete,
} from "./hooks/revalidate-tag"

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
    {
      name: "deliveryTime",
      type: "group",
      label: "Delivery Time (business days)",
      admin: {
        description:
          "Expected delivery timeline for this service area, in business days.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "minDays",
              type: "number",
              label: "Min Delivery (business days)",
              required: true,
              min: 0,
            },
            {
              name: "maxDays",
              type: "number",
              label: "Max Delivery (business days)",
              required: true,
              min: 0,
              validate: ((value, { siblingData }) => {
                const { minDays } = siblingData as { minDays?: number }
                if (
                  typeof value === "number" &&
                  typeof minDays === "number" &&
                  value < minDays
                ) {
                  return "Max delivery days must be greater than or equal to min delivery days."
                }
                return true
              }) as NumberFieldValidation,
            },
          ],
        },
      ],
    },
    {
      name: "shippingRates",
      type: "array",
      label: "Shipping Rates",
      labels: {
        singular: "Shipping Rate",
        plural: "Shipping Rates",
      },
      admin: {
        description: "Shipping price per package tier for this area.",
      },
      fields: [
        {
          name: "package",
          type: "relationship",
          relationTo: "packages",
          required: true,
          label: "Package",
        },
        {
          name: "price",
          type: "number",
          label: "Shipping Price (KES)",
          required: true,
          min: 0,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateServiceAreasTag],
    afterDelete: [revalidateServiceAreasTagOnDelete],
  },
}
