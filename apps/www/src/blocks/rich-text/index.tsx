import { Block } from "payload"

export const richText: Block = {
  slug: "richText",
  interfaceName: "RichTextBlock",
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
    },
  ],
}
