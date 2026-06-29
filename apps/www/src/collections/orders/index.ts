import { adminOnly } from "@/access/admin"
import { adminOnlyFieldAccess } from "@/access/admin-field"
import { isAdmin } from "@/access/is-admin"
import { ownerOrAdmin } from "@/access/owner-or-admin"
import { fulfillmentType, orderStatus, paymentStatus } from "@/const/orders"
import { autoincrement } from "@/payload-hooks/auto-increment"
import { CollectionConfig } from "payload"
import { setOrderTotals } from "./hooks/set-order-totals"
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
    create: ownerOrAdmin,
    read: ownerOrAdmin,
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
      name: "fulfillmentType",
      type: "select",
      options: fulfillmentType,
      defaultValue: "delivery",
      required: true,
      admin: {
        readOnly: true,
        description:
          "How the customer receives the order: delivery or store pickup.",
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "deliveryAddress",
      type: "relationship",
      relationTo: "addresses",
      // Not required: store-pickup orders have no delivery address.
      required: false,
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
      name: "subtotal",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "discountTotal",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: "Total savings applied across all line items.",
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "deliveryFee",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "estimatedDelivery",
      type: "group",
      label: "Estimated Delivery",
      admin: {
        readOnly: true,
        description: "Delivery window computed at order creation.",
      },
      fields: [
        {
          name: "minDate",
          type: "date",
          access: {
            create: adminOnlyFieldAccess,
            update: adminOnlyFieldAccess,
          },
        },
        {
          name: "maxDate",
          type: "date",
          access: {
            create: adminOnlyFieldAccess,
            update: adminOnlyFieldAccess,
          },
        },
      ],
    },
    {
      name: "shipTogether",
      type: "checkbox",
      defaultValue: true,
      admin: {
        readOnly: true,
        description:
          "Customer preference: hold all items and ship together when backorder stock arrives.",
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: "total",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
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
      setOrderTotals,
      autoincrement({ field: "id", startFrom: 31032025, step: 46 }),
    ],
  },
}
