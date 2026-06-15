import { adminOnly } from "@/access/admin"
import { adminOnlyFieldAccess } from "@/access/admin-field"
import { isAdmin } from "@/access/is-admin"
import { userOwned } from "@/access/user-owned"
import { orderStatus, paymentStatus } from "@/const/orders"
import { autoincrement } from "@/payload-hooks/auto-increment"
import { CollectionConfig } from "payload"
import { getOrderTotal } from "./hooks/get-order-total"
import { getOrderStatus } from "./hooks/status"
import { validateOrderItems } from "./hooks/validate-order-items"

export const orders: CollectionConfig = {
  slug: "orders",
  labels: {
    singular: "Order",
    plural: "Orders",
  },
  typescript: {
    interface: "Order",
  },
  access: {
    create: userOwned,
    read: userOwned,
    update: adminOnly,
    delete: adminOnly,
    admin: isAdmin,
  },
  fields: [
    {
      name: "id",
      label: "Order Id",
      type: "number",
      required: true,
      admin: {
        hidden: true,
      },
      unique: true,
      index: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "deliveryAddress",
      type: "relationship",
      relationTo: "addresses",
      required: true,
      access: {
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "productVariant",
          type: "relationship",
          relationTo: "product-variants",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
        },
        {
          name: "snapshot",
          type: "json",
          required: true,
          admin: {
            description: "Snapshot of the product line at the time of purchase",
            hidden: true,
          },
          access: {
            create: adminOnlyFieldAccess,
            update: adminOnlyFieldAccess,
          },
        },
      ],
    },
    {
      name: "total",
      type: "number",
      defaultValue: 0,
      virtual: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        afterRead: [getOrderTotal],
      },
    },
    {
      name: "status",
      type: "select",
      options: orderStatus,
      defaultValue: "pending",
      required: true,
      virtual: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        afterRead: [getOrderStatus],
      },
    },
    {
      name: "paymentStatus",
      type: "select",
      required: true,
      defaultValue: "unpaid",
      options: paymentStatus,
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "paystackAccessCode",
      type: "text",
      admin: {
        description:
          "Access code returned by Paystack when initiating a transaction. We can re use to charge the payment.",
        hidden: true,
      },
      access: {
        read: adminOnlyFieldAccess,
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "snapshot",
      type: "json",
      required: true,
      admin: {
        description: "Snapshot of the order at the time of purchase",
        hidden: true,
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "transactions",
      type: "join",
      collection: "transactions",
      on: "order",
      hasMany: false,
      access: {
        read: adminOnlyFieldAccess,
      },
    },
  ],
  hooks: {
    beforeChange: [
      validateOrderItems,
      autoincrement({ field: "id", startFrom: 31032025, step: 46 }),
    ],
  },
}
