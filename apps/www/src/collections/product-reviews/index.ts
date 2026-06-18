import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { ownerOrAdmin } from "@/access/owner-or-admin"
import { activeField } from "@/fields/active"
import { CollectionConfig } from "payload"
import { validateCanReview } from "./hooks/validate-can-review"

export const productReviews: CollectionConfig = {
  slug: "product-reviews",
  labels: {
    singular: "Product Review",
    plural: "Product Reviews",
  },
  typescript: {
    interface: "ProductReview",
  },
  access: {
    create: ownerOrAdmin,
    read: everyone,
    update: adminOnly,
    delete: ownerOrAdmin,
    admin: isAdmin,
  },
  admin: {
    useAsTitle: "user",
    defaultColumns: ["user", "productVariant", "rating", "createdAt"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "productVariant",
      type: "relationship",
      relationTo: "product-variants",
      required: true,
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
      validate: (value: number | number[] | null | undefined) => {
        const rating = Array.isArray(value) ? value[0] : value
        if (typeof rating !== "number" || Number.isNaN(rating)) {
          return "A rating is required."
        }
        if (rating < 1 || rating > 5) {
          return "Rating must be between 1 and 5."
        }
        if ((rating * 2) % 1 !== 0) {
          return "Rating must be in increments of 0.5."
        }
        return true
      },
    },
    {
      name: "message",
      type: "textarea",
    },
    activeField(),
  ],
  hooks: {
    beforeChange: [validateCanReview],
  },
  indexes: [
    {
      fields: ["user", "productVariant"],
      unique: true,
    },
    {
      fields: ["productVariant"],
    },
  ],
}
