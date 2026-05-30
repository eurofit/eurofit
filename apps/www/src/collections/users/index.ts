import { CollectionConfig } from "payload"

export const users: CollectionConfig = {
  slug: "users",
  auth: true,
  fields: [
    {
      type: "checkbox",
      name: "isSuspended",
      label: "Suspend User",
      required: true,
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
}
