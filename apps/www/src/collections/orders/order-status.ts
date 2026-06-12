import { orderStatus as orderStatusOptions } from "@/const/orders"
import { CollectionConfig } from "payload"

export const orderStatus: CollectionConfig = {
  slug: "order-statuses",
  labels: {
    singular: "Order Status",
    plural: "Order Statuses",
  },
  typescript: {
    interface: "OrderStatus",
  },
  fields: [
    {
      name: "order",
      type: "relationship",
      relationTo: "orders",
      required: true,
    },
    {
      name: "staff",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: orderStatusOptions,
      defaultValue: "pending",
      required: true,
    },
    {
      name: "visibleToCustomer",
      label: "Visible to customer",
      type: "checkbox",
      defaultValue: true,
      required: true,
    },
  ],
}
