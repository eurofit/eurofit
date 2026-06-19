import { adminOnly } from "@/access/admin"
import { adminOnlyFieldAccess } from "@/access/admin-field"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { activeField } from "@/fields/active"
import { CollectionConfig, slugField } from "payload"
import {
  revalidateProductTag,
  revalidateProductTagOnDelete,
} from "./hooks/revalidate-tag"

export const products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "Product",
    plural: "Products",
  },
  typescript: {
    interface: "Product",
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
    defaultColumns: ["title", "brand", "origin", "supplierImageUrl"],
  },
  defaultSort: "title",
  fields: [
    activeField(),
    slugField(),
    {
      name: "title",
      type: "text",
      label: "Title",
      admin: {
        description:
          "A descriptive title for the product, used for display purposes.",
      },
      required: true,
    },
    {
      name: "brand",
      type: "relationship",
      label: "Brand",
      relationTo: "brands",
      hasMany: false,
      required: true,
      admin: {
        description: "Select the brand associated with this product.",
        allowEdit: true,
        allowCreate: false,
      },
    },
    {
      name: "origin",
      type: "text",
      label: "Product Origin",
      admin: {
        description:
          "Specify the origin of the product, such as country or region.",
      },
    },
    {
      name: "images",
      type: "upload",
      label: "Product Images",
      relationTo: "media",
      hasMany: true,
      maxRows: 6,
    },
    {
      name: "supplierImageUrl",
      type: "text",
      label: "The product supplier image URL",
      admin: {
        description:
          "Enter the URL of the product image provided by the supplier or your source.",
        components: {
          Cell: {
            path: "@/fields/image/components/image-cell#ImageCell",
          },
        },
      },
    },
    {
      name: "productInformation",
      type: "textarea",
      label: "Product Information",
      admin: {
        description:
          "Provide detailed information about the product, including features, specifications, and usage instructions.",
      },
    },
    {
      name: "nutritionalInformation",
      type: "textarea",
      label: "Nutritional Information",
      admin: {
        description: "Provide nutritional information for the product.",
      },
    },
    {
      name: "supplierUrl",
      type: "text",
      label: "Supplier URL",
      admin: {
        description:
          "Enter the URL of the product page on the supplier's website.",
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
      },
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      label: "Categories",
      admin: {
        description: "Select categories that this product belongs to.",
        allowCreate: true,
        allowEdit: true,
      },
    },
    {
      name: "productVariants",
      label: "Product Variants",
      type: "join",
      collection: "product-variants",
      on: "product",
      hasMany: true,
      admin: {
        allowCreate: true,
      },
      required: true,
    },
    {
      name: "tags",
      type: "join",
      collection: "tags",
      on: "products",
    },
  ],
  hooks: {
    afterChange: [revalidateProductTag],
    afterDelete: [revalidateProductTagOnDelete],
  },
}
