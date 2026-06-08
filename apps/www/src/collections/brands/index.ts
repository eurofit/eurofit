import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { activeField } from "@/fields/active"
import type { CollectionConfig } from "payload"
import { slugField } from "payload"
import { revalidateBrandsTag } from "./hooks/revalidate-brands-tag"

export const brands: CollectionConfig = {
  slug: "brands",
  typescript: {
    interface: "Brand",
  },
  labels: {
    singular: "Brand",
    plural: "Brands",
  },
  access: {
    create: adminOnly,
    read: everyone,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  admin: {
    description: "Manage brands associated with products in the store.",
    useAsTitle: "title",
    listSearchableFields: ["id", "title", "slug"],
    defaultColumns: ["supplierImage", "title"],
  },
  defaultPopulate: {
    slug: true,
    title: true,
    supplierImage: true,
  },
  defaultSort: "title",
  fields: [
    slugField(),
    activeField(),
    {
      name: "title",
      type: "text",
      label: "Brand Name",
      required: true,
      unique: true,
      admin: {
        description:
          "The name of the brand, used for display and identification.",
      },
      index: true,
    },
    {
      name: "supplierImageUrl",
      label: "Brand Image URLFrom the Supplier",
      type: "text",
      admin: {
        components: {
          Cell: {
            path: "@/fields/image/components/image-cell#ImageCell",
          },
        },
        description:
          "The main image like logo of the brand. This is used as the primary image for the brand. If you have specified the image, this will be used as a fallback.",
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "Brand Logo",
      admin: {
        description:
          "The logo of the brand. If you have specified the supplierImage, this will be used first and the supplierImage will be used as a fallback.",
      },
    },
  ],
  hooks: {
    afterChange: [revalidateBrandsTag],
  },
}
