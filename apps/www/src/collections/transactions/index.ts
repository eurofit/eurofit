import { adminOnly } from "@/access/admin"
import { isAdmin } from "@/access/is-admin"
import { CollectionConfig } from "payload"
import { markOrderPaid } from "./hooks/mark-order-paid"
import { sendOrderConfimationEmail } from "./hooks/send-order-confimation-email"
import { validatePaidAmount } from "./hooks/validate-amount-paid"

export const transactions: CollectionConfig = {
  slug: "transactions",
  labels: {
    singular: "Transaction",
    plural: "Transactions",
  },
  typescript: {
    interface: "Transaction",
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  fields: [
    {
      name: "order",
      type: "relationship",
      relationTo: "orders",
      required: true,
    },
    {
      name: "amount",
      type: "number",
      required: true,
    },
    {
      name: "ref",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "provider",
      type: "text",
      required: true,
    },
    {
      name: "isTest",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Indicates if the transaction is a test transaction",
        hidden: true,
      },
    },
    {
      name: "paidAt",
      type: "date",
      required: true,
    },
    {
      name: "snapshot",
      type: "json",
      required: true,
    },
  ],
  hooks: {
    beforeChange: [validatePaidAmount],
    afterChange: [markOrderPaid, sendOrderConfimationEmail],
  },
}
