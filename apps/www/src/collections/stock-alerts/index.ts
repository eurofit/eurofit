import { adminOnly } from "@/access/admin"
import { adminOrSelf } from "@/access/admin-or-self"
import { isAdmin } from "@/access/is-admin"
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
    create: adminOrSelf,
    read: adminOrSelf,
    update: adminOnly,
    delete: adminOrSelf,
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
