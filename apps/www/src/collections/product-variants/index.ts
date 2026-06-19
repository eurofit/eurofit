import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { activeField } from "@/fields/active"
import { CollectionConfig, slugField } from "payload"
import { checkIfLowStock } from "./hooks/check-if-low-stock"
import { checkIfOutOfStock } from "./hooks/check-if-out-stock"
import { checkIfPreorder } from "./hooks/check-if-preorder"
import { checkIfNotfiyRequested } from "./hooks/check-notify-requested"
import { checkIfWishlisted } from "./hooks/check-wishlisted"
import {
  revalidateProductVariantTag,
  revalidateProductVariantTagOnDelete,
} from "./hooks/revalidate-tag"
import { validateRetailPrice } from "./validators/validate-retail-price"

export const productVariants: CollectionConfig = {
  slug: "product-variants",
  labels: {
    singular: "Product Variant",
    plural: "Product Variants",
  },
  typescript: {
    interface: "ProductVariant",
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
    listSearchableFields: [
      "sku",
      "variant",
      "title",
      "barcode",
      "slug",
      "srcProductCode",
    ],
    defaultColumns: ["title", "variant", "sku", "expiryDate", "stock"],
  },
  forceSelect: {
    stock: true,
    supplierStock: true,
  },

  fields: [
    // === Sidebar Fields ===
    slugField(),
    activeField(),
    {
      name: "sku",
      type: "text",
      required: true,
      unique: true,
      label: "SKU",
      admin: {
        position: "sidebar",
        description: "Unique internal ID for managing inventory.",
      },
    },

    // === General Information ===
    {
      type: "collapsible",
      label: "General Information",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          index: true,
          label: "Product Title",
          admin: {
            description:
              'Full name of the product, e.g. "Optimum Nutrition Whey 900g Banana".',
          },
        },
        {
          name: "detailTitle",
          type: "text",
          index: true,
          label: "Detail Title",
          admin: {
            description:
              "Longer descriptive title used on the product detail page",
          },
        },

        {
          type: "row",
          fields: [
            {
              name: "size",
              type: "text",
              label: "Size",
              admin: {
                description: 'Package size, e.g. "900g".',
              },
            },
            {
              name: "flavorColor",
              type: "text",
              label: "Flavor / Color",
              admin: {
                description: "Flavor or color of this product variant.",
              },
            },
          ],
        },
        {
          name: "variant",
          type: "text",
          label: "Variant",
          admin: {
            description:
              'Display name like "900g / Banana Cream". Auto or manual.',
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "product",
              label: "Parent Product",
              type: "relationship",
              relationTo: "products",
              required: true,
              admin: {
                description: "The main product this variation belongs to.",
              },
            },
            {
              name: "category",
              type: "text",
              label: "Category",
              admin: {
                description: 'Product type like "Protein", "Vitamins".',
              },
            },
          ],
        },
      ],
    },

    // === Images ===
    {
      type: "collapsible",
      label: "Images",
      fields: [
        {
          name: "images",
          type: "upload",
          relationTo: "media",
          hasMany: true,
          maxRows: 6,
          label: "Product Images",
          admin: {
            description:
              "Upload up to 6 images for this product. If none, it will use the parent product image.",
          },
        },
      ],
    },

    // === Pricing ===
    {
      type: "collapsible",
      label: "Pricing",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "supplierPrice",
              type: "number",
              label: "Supplier Price (GBP)",
              admin: {
                description: "Original price from the supplier in GBP.",
              },
            },
            {
              name: "supplierDiscountedPrice",
              type: "number",
              label: "Supplier Discounted Price (GBP)",
              admin: {
                description: "Discounted supplier price, if any.",
              },
            },
            {
              name: "priceFetchedAt",
              type: "date",
              label: "Last Price Update",
              admin: {
                description:
                  "When the supplier price was last updated. Used to determine if price refresh is needed.",
              },
            },
          ],
        },
        {
          name: "costPrice",
          type: "number",
          label: "Cost Price (KES)",
          admin: {
            description:
              "Calculated cost price in KES (from supplier price + shipping + import costs). Used for margin calculations.",
          },
        },
        {
          name: "retailPrice",
          type: "number",
          label: "Retail Price (KES)",
          validate: validateRetailPrice,
          admin: {
            description:
              "Customer price in KES (calculated from supplier price, shipping, margin). Must be a non-negative integer.",
          },
        },
      ],
    },

    // === Inventory ===
    {
      type: "collapsible",
      label: "Inventory",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "stock",
              type: "number",
              defaultValue: 0,
              required: true,
              label: "In-House Stock",
              admin: {
                description: "Units you have on hand.",
              },
            },
            {
              name: "supplierStock",
              type: "number",
              label: "Supplier Stock",
              admin: {
                description:
                  "Units available from manufacturer / distributor or any external source.",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "onPallet",
              type: "number",
              label: "Units per Pallet",
              admin: {
                description: "How many units fit on one pallet.",
              },
            },
            {
              name: "inCase",
              type: "number",
              label: "Units per Case",
              admin: {
                description: "How many units in one box / case.",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "expiryDate",
              type: "date",
              label: "Expiry Date",
              admin: {
                description: "Product expiration (if applies).",
              },
            },
            {
              name: "weight",
              type: "number",
              label: "Weight (Kg)",
              admin: {
                description: "Used for shipping cost calc.",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "servingSizePerContainer",
              type: "number",
              label: "Total Servings",
              admin: {
                description:
                  "How much product is in the pack (helps predict how long it lasts).",
              },
            },
            {
              name: "servingSize",
              type: "number",
              label: "Daily Serving",
              admin: {
                description:
                  "Recommended daily amount. Used to estimate finish date.",
              },
            },
          ],
        },
      ],
    },

    // === Codes ===
    {
      type: "collapsible",
      label: "Codes & Compliance",
      fields: [
        {
          name: "supplierProductCode",
          type: "text",
          label: "Supplier Product Code",
          admin: {
            description: "Supplier’s product code.",
          },
        },
        {
          name: "barcode",
          type: "text",
          label: "Barcode",
          admin: {
            description: "Retail scan code (EAN/UPC).",
          },
          index: true,
        },
        {
          name: "exportCommodityCode",
          type: "text",
          label: "Export Commodity Code",
          admin: {
            description: "Customs / HS code for export.",
          },
        },
      ],
    },
    {
      name: "isNotifyRequested",
      type: "checkbox",
      defaultValue: false,
      required: true,
      virtual: true,
      admin: {
        hidden: true,
        description:
          "Indicates if a customer has requested notification for back-in-stock status. Managed programmatically.  ",
      },
      hooks: {
        afterRead: [checkIfNotfiyRequested],
      },
    },
    {
      name: "isWishlisted",
      type: "checkbox",
      defaultValue: false,
      required: true,
      virtual: true,
      admin: {
        hidden: true,
        description:
          "Indicates if a customer has added the product to their wishlist. Managed programmatically.  ",
      },
      hooks: {
        afterRead: [checkIfWishlisted],
      },
    },

    {
      name: "isLowStock",
      type: "checkbox",
      defaultValue: false,
      required: true,
      virtual: true,
      admin: {
        hidden: true,
        description:
          "Indicates if the product stock is below the low stock threshold. Managed programmatically.",
      },
      hooks: {
        afterRead: [checkIfLowStock],
      },
    },
    {
      name: "isOutOfStock",
      type: "checkbox",
      defaultValue: true,
      required: true,
      virtual: true,
      admin: {
        hidden: true,
        description:
          "Indicates if the product is out of stock. Managed programmatically.",
      },
      hooks: {
        afterRead: [checkIfOutOfStock],
      },
    },

    {
      name: "isPreorder",
      type: "checkbox",
      defaultValue: false,
      required: true,
      virtual: true,
      admin: {
        hidden: true,
        description:
          "Indicates if the product is back-orderable. Managed programmatically.",
      },
      hooks: {
        afterRead: [checkIfPreorder],
      },
    },
    {
      name: "tags",
      type: "join",
      collection: "tags",
      on: "productVariants",
    },
  ],
  hooks: {
    afterChange: [revalidateProductVariantTag],
    afterDelete: [revalidateProductVariantTagOnDelete],
  },
}
