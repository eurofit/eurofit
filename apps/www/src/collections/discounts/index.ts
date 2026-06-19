import { CollectionConfig } from "payload"
import { addStaff } from "./hooks/add-staff"

const DISCOUNT_TYPES = [
  {
    label: "Amount",
    value: "amount",
  },
  {
    label: "Buy X Get Y",
    value: "buy-x-get-y",
  },
]

const DISCOUNT_VALUE_TYPES = [
  {
    label: "Fixed Amount",
    value: "fixed",
  },
  {
    label: "Percentage",
    value: "percentage",
  },
]

const APPLIES_TO_OPTIONS = [
  {
    label: "Products",
    value: "products",
  },
  {
    label: "Collections",
    value: "collections",
  },
  {
    label: "Categories",
    value: "categories",
  },
]

export const discounts: CollectionConfig = {
  slug: "discounts",
  fields: [
    {
      name: "isActive",
      type: "checkbox",
      required: true,
      defaultValue: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "select",
      options: DISCOUNT_TYPES,
      required: true,
      defaultValue: "amount",
    },
    {
      type: "row",
      fields: [
        {
          name: "valueType",
          type: "select",
          options: DISCOUNT_VALUE_TYPES,
          defaultValue: "fixed",
          admin: {
            condition: (data) => data?.type === "amount",
          },
        },
        {
          name: "value",
          type: "number",
          defaultValue: 0,
          admin: {
            condition: (data) => data?.type === "amount",
          },
        },
      ],
    },
    {
      name: "appliesTo",
      type: "select",
      options: APPLIES_TO_OPTIONS,
      defaultValue: "products",
      admin: {
        readOnly: true,
        condition: (data) => data?.type === "buy-x-get-y",
      },
    },
    {
      name: "productVariants",
      type: "relationship",
      relationTo: "product-variants",
      hasMany: true,
      admin: {
        condition: (data) =>
          data?.appliesTo === "products" && data.type === "amount",
      },
    },
    {
      name: "startDate",
      type: "date",
      required: true,
      defaultValue: new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "endDate",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          minDate: new Date(),
        },
      },
    },
    {
      name: "staff",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        readOnly: true,
      },
    },
  ],

  hooks: {
    beforeChange: [addStaff],
  },
}
