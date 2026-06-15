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
          relationTo: "products",
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
