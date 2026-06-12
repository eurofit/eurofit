import { CollectionConfig } from "payload"
import { markOrderPaid } from "./hooks/mark-order-paid"
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
    afterChange: [markOrderPaid],
  },
}
