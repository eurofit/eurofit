import { adminOnly } from "@/access/admin"
import { adminOnlyFieldAccess } from "@/access/admin-field"
import { isAdmin } from "@/access/is-admin"
import { activeField } from "@/fields/active"
import type { Discount } from "@/payload-types"
import type { CollectionConfig, NumberFieldValidation } from "payload"

import { addStaff } from "./hooks/add-staff"

const DISCOUNT_TARGETS = [
  { label: "Product", value: "product" },
  { label: "Free shipping", value: "free_shipping" },
]

const DISCOUNT_METHODS = [
  { label: "Discount code", value: "code" },
  { label: "Automatic discount", value: "automatic" },
]

const PRODUCT_DISCOUNT_TYPES = [
  { label: "Amount off products", value: "amount_off" },
  { label: "Buy X get Y", value: "buy_x_get_y" },
]

const VALUE_TYPES = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed amount", value: "fixed" },
]

// TODO: add "collections" option once a collections concept exists.
const APPLIES_TO_OPTIONS = [{ label: "Products", value: "products" }]

const GET_DISCOUNT_TYPES = [
  { label: "Percentage", value: "percentage" },
  { label: "Amount off each", value: "amount_off_each" },
  { label: "Free", value: "free" },
]

const ELIGIBILITY_OPTIONS = [
  { label: "All customers", value: "all" },
  { label: "Specific customer tags", value: "tags" },
  { label: "Specific customers", value: "customers" },
]

const isAmountOff = (data: Partial<Discount>): boolean =>
  data?.discountTarget === "product" &&
  data?.productDiscountType === "amount_off"

const isBuyXGetY = (data: Partial<Discount>): boolean =>
  data?.discountTarget === "product" &&
  data?.productDiscountType === "buy_x_get_y"

export const discounts: CollectionConfig = {
  slug: "discounts",
  typescript: {
    interface: "Discount",
  },
  labels: {
    singular: "Discount",
    plural: "Discounts",
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "discountTarget", "discountMethod", "isActive"],
  },
  fields: [
    activeField(),
    {
      name: "title",
      type: "text",
      label: "Title",
      required: true,
      admin: {
        description: "Internal name for this discount.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      admin: {
        description: "Internal notes.",
      },
    },

    // ── Discount target ───────────────────────────────────────────────
    {
      name: "discountTarget",
      type: "radio",
      required: true,
      defaultValue: "product",
      options: DISCOUNT_TARGETS,
      admin: {
        description: "What this discount applies to.",
      },
    },

    // ── Method ────────────────────────────────────────────────────────
    {
      name: "discountMethod",
      type: "radio",
      required: true,
      defaultValue: "code",
      options: DISCOUNT_METHODS,
    },
    {
      name: "code",
      type: "text",
      label: "Discount code",
      unique: true,
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      admin: {
        condition: (data) => data?.discountMethod === "code",
        description: "Customers must enter this code at checkout.",
      },
    },
    {
      // Named `label` (not `title`) to avoid clashing with the internal title field.
      name: "label",
      type: "text",
      label: "Title",
      admin: {
        condition: (data) => data?.discountMethod === "automatic",
        description: "Customers will see this in their cart and at checkout.",
      },
    },

    // ── Product discount configuration ────────────────────────────────
    {
      name: "productDiscountType",
      type: "radio",
      defaultValue: "amount_off",
      options: PRODUCT_DISCOUNT_TYPES,
      admin: {
        condition: (data) => data?.discountTarget === "product",
        description: "Discount specific products or collections of products.",
      },
    },

    // Amount off products
    {
      name: "valueType",
      type: "radio",
      defaultValue: "percentage",
      options: VALUE_TYPES,
      admin: {
        condition: (data) => isAmountOff(data),
      },
    },
    {
      name: "discountAmount",
      type: "number",
      min: 0,
      admin: {
        condition: (data) => isAmountOff(data),
      },
      validate: ((value, { data }) => {
        if (!isAmountOff(data as Partial<Discount>)) return true
        if (value === null || value === undefined) {
          return "A discount value is required."
        }
        if (typeof value === "number" && value < 0) {
          return "The discount value must be a non-negative number."
        }
        return true
      }) as NumberFieldValidation,
    },
    {
      name: "appliesTo",
      type: "radio",
      defaultValue: "products",
      options: APPLIES_TO_OPTIONS,
      admin: {
        condition: (data) => isAmountOff(data),
      },
    },
    {
      name: "eligibleVariants",
      type: "relationship",
      relationTo: "product-variants",
      hasMany: true,
      admin: {
        condition: (data) => isAmountOff(data),
      },
    },

    // Buy X get Y
    {
      name: "buyQuantity",
      type: "number",
      label: "Quantity (customer buys)",
      min: 1,
      admin: {
        condition: (data) => isBuyXGetY(data),
      },
      validate: ((value, { data }) => {
        if (!isBuyXGetY(data as Partial<Discount>)) return true
        if (value === null || value === undefined) {
          return "A buy quantity is required."
        }
        if (typeof value === "number" && value < 1) {
          return "The buy quantity must be at least 1."
        }
        return true
      }) as NumberFieldValidation,
    },
    {
      name: "buyVariants",
      type: "relationship",
      relationTo: "product-variants",
      hasMany: true,
      admin: {
        condition: (data) => isBuyXGetY(data),
      },
    },
    {
      name: "getQuantity",
      type: "number",
      label: "Quantity (customer gets)",
      min: 1,
      admin: {
        condition: (data) => isBuyXGetY(data),
      },
      validate: ((value, { data }) => {
        if (!isBuyXGetY(data as Partial<Discount>)) return true
        if (value === null || value === undefined) {
          return "A get quantity is required."
        }
        if (typeof value === "number" && value < 1) {
          return "The get quantity must be at least 1."
        }
        return true
      }) as NumberFieldValidation,
    },
    {
      name: "getVariants",
      type: "relationship",
      relationTo: "product-variants",
      hasMany: true,
      admin: {
        condition: (data) => isBuyXGetY(data),
        description:
          "Customers must add the quantity of items specified below to their cart.",
      },
    },
    {
      name: "getDiscountType",
      type: "radio",
      label: "At a discounted value",
      defaultValue: "percentage",
      options: GET_DISCOUNT_TYPES,
      admin: {
        condition: (data) => isBuyXGetY(data),
      },
    },
    {
      name: "getDiscountAmount",
      type: "number",
      min: 0,
      admin: {
        condition: (data) =>
          isBuyXGetY(data) &&
          (data?.getDiscountType === "percentage" ||
            data?.getDiscountType === "amount_off_each"),
      },
    },

    // ── Free shipping configuration ───────────────────────────────────
    {
      name: "applicableAreas",
      type: "relationship",
      relationTo: "service-areas",
      hasMany: true,
      admin: {
        condition: (data) => data?.discountTarget === "free_shipping",
        description: "Leave empty to apply to all service areas.",
      },
    },
    {
      name: "hasShippingRateLimit",
      type: "checkbox",
      label: "Exclude shipping rates over a certain amount",
      defaultValue: false,
      admin: {
        condition: (data) => data?.discountTarget === "free_shipping",
      },
    },
    {
      name: "maxShippingRate",
      type: "number",
      label: "Maximum shipping rate (KES)",
      min: 0,
      admin: {
        condition: (data) =>
          data?.discountTarget === "free_shipping" &&
          data?.hasShippingRateLimit === true,
      },
    },

    // ── Customer eligibility ──────────────────────────────────────────
    {
      name: "eligibility",
      type: "radio",
      required: true,
      defaultValue: "all",
      options: ELIGIBILITY_OPTIONS,
    },
    {
      name: "eligibleTags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      filterOptions: () => ({ type: { equals: "user" } }),
      admin: {
        condition: (data) => data?.eligibility === "tags",
      },
    },
    {
      name: "eligibleCustomers",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      admin: {
        condition: (data) => data?.eligibility === "customers",
      },
    },

    // ── Active dates ──────────────────────────────────────────────────
    {
      name: "startDate",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "shouldSetEndDate",
      type: "checkbox",
      label: "Set end date",
      defaultValue: false,
    },
    {
      name: "endDate",
      type: "date",
      admin: {
        condition: (data) => data?.shouldSetEndDate === true,
        date: {
          pickerAppearance: "dayAndTime",
        },
        description: "When absent, the discount runs indefinitely.",
      },
    },

    // ── Audit ─────────────────────────────────────────────────────────
    {
      name: "staff",
      type: "relationship",
      relationTo: "users",
      required: true,
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "The admin who created this discount.",
      },
    },
  ],
  hooks: {
    beforeChange: [addStaff],
  },
}
