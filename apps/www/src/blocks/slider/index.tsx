import { Block } from "payload"

export const slider: Block = {
  slug: "slider",
  labels: {
    singular: "Slider",
    plural: "Sliders",
  },
  interfaceName: "SliderBlock",
  fields: [
    {
      name: "slides",
      type: "array",
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "images",
          type: "array",
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            {
              name: "isDefault",
              label: "Default",
              type: "checkbox",
              defaultValue: false,
              required: true,
            },
            {
              name: "isMobile",
              label: "Mobile",
              type: "checkbox",
              defaultValue: false,
              required: true,
            },
          ],
          required: true,
        },
        {
          name: "link",
          type: "text",
        },
      ],
      required: true,
    },
    {
      type: "group",
      label: "Config",
      fields: [
        {
          name: "snaps",
          type: "select",
          options: [
            {
              label: "One",
              value: "1",
            },
            {
              label: "Three",
              value: "3",
            },
          ],
          required: true,
          defaultValue: "1",
        },
        {
          type: "row",
          fields: [
            {
              name: "active",
              type: "checkbox",
              required: true,
              defaultValue: true,
            },
            {
              name: "showArrows",
              label: "Show Arrows",
              type: "checkbox",
              defaultValue: true,
            },
            {
              name: "showDots",
              label: "Show Dots",
              type: "checkbox",
              defaultValue: true,
            },
          ],
        },
      ],
    },
  ],
}
