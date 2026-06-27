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
