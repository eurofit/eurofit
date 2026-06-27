import { iconField } from "@/fields/icon"
import { Block } from "payload"

export const productList: Block = {
  slug: "productList",
  labels: {
    singular: "Product List",
    plural: "Product Lists",
  },
  interfaceName: "ProductListBlock",
  fields: [
    iconField(),
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
    },
    {
      name: "products",
      type: "array",
      minRows: 5,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "product-variants",
        },
      ],
    },
    {
      name: "timer",
      type: "date",
      label: "Timer",
    },
    {
      name: "link",
      type: "group",
      label: "Link",
      fields: [
        {
          name: "href",
          type: "text",
          label: "URL",
          required: true,
        },
        {
          name: "label",
          type: "text",
          label: "Label",
          required: true,
          defaultValue: "View more",
        },
      ],
    },
    {
      name: "styles",
      type: "group",
      fields: [
        {
          name: "headerBg",
          type: "text",
        },
        {
          name: "headerFg",
          type: "text",
        },
        {
          name: "contentBg",
          type: "text",
        },
        {
          name: "contentFg",
          type: "text",
        },
      ],
    },
  ],
}
