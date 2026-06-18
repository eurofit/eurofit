import { adminOnly } from "@/access/admin"
import { isAdmin } from "@/access/is-admin"
import { ownerOrAdmin } from "@/access/owner-or-admin"
import { CollectionConfig } from "payload"
import { validateOutOfStock } from "./hooks/validate-out-of-stock"

export const stockAlerts: CollectionConfig = {
  slug: "stock-alerts",
  labels: {
    singular: "Stock Alert",
    plural: "Stock Alerts",
  },
  typescript: {
    interface: "StockAlert",
  },
  access: {
    create: ownerOrAdmin,
    read: ownerOrAdmin,
    update: adminOnly,
    delete: ownerOrAdmin,
    admin: isAdmin,
  },
  admin: {
    useAsTitle: "user",
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "productVariant",
      type: "relationship",
      relationTo: "product-variants",
      required: true,
    },
  ],
  hooks: {
    beforeChange: [validateOutOfStock],
  },
  indexes: [
    {
      fields: ["user", "productVariant"],
      unique: true,
    },
  ],
}
