import { adminOnly } from "@/access/admin"
import { everyone } from "@/access/everyone"
import { isAdmin } from "@/access/is-admin"
import { activeField } from "@/fields/active"
import { titleCase } from "@/payload-hooks/title-case"
import { CollectionConfig, slugField } from "payload"
import { revalidatePageTag } from "./hooks/revalidate-page-tag"

export const pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "page",
    plural: "pages",
  },
  typescript: {
    interface: "Page",
  },
  access: {
    create: adminOnly,
    read: everyone,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      label: "title",
      type: "text",
      required: true,
      hooks: {
        beforeValidate: [titleCase],
      },
    },
    slugField(),
    activeField(),
    {
      name: "layout",
      label: "Layout",
      type: "blocks",
      blockReferences: ["slider", "faq", "richText"],
      blocks: [],
      required: true,
      admin: {
        initCollapsed: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePageTag],
  },
}
