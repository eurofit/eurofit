import { Block } from "payload"

export const faq: Block = {
  slug: "faq",
  interfaceName: "FAQBlock",
  fields: [
    {
      name: "faqs",
      type: "array",
      fields: [
        {
          name: "question",
          type: "text",
          required: true,
        },
        {
          name: "answer",
          type: "richText",
          required: true,
        },
      ],
      required: true,
    },
    {
      name: "center",
      type: "checkbox",
      label: "Center content",
      defaultValue: false,
      required: true,
    },
  ],
}
