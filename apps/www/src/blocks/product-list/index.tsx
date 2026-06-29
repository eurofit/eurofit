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
    {
      type: "row",
      fields: [
        iconField(),
        {
          name: "iconFillColor",
          type: "text",
          label: "Icon Fill Color",
          admin: {
            description:
              "CSS color value for the icon (e.g. #ffffff or white).",
          },
        },
      ],
    },
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
        },
        {
          name: "label",
          type: "text",
          label: "Label",
          defaultValue: "View more",
        },
      ],
    },
    {
      name: "styles",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "headerBg", type: "text", label: "Header Background" },
            { name: "headerFg", type: "text", label: "Header Foreground" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "contentBg", type: "text", label: "Content Background" },
            { name: "contentFg", type: "text", label: "Content Foreground" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "cardBg", type: "text", label: "Card Background" },
            { name: "cardFg", type: "text", label: "Card Foreground" },
          ],
        },
      ],
    },
  ],
}
