import { isAdmin } from "@/access/is-admin"
import { CollectionConfig } from "payload"
import { computeTotal } from "./hooks/compute-total"
import { ensureSnapshots } from "./hooks/ensure-snapshots"
import { revalidateCache } from "./hooks/revalidate-tag"
import { validateCartItems } from "./hooks/validate-cart-items"
import { validateQty } from "./validators/validate-qty"

export const carts: CollectionConfig = {
  slug: "carts",
  typescript: {
    interface: "Cart",
  },
  access: {
    create: ownerOrAdmin,
    read: ownerOrAdmin,
    update: ownerOrAdmin,
    delete: ownerOrAdmin,
    admin: isAdmin,
  },
  labels: {
    singular: "Cart",
    plural: "Carts",
  },
  admin: {
    useAsTitle: "user",
    defaultColumns: ["user", "items", "total"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      unique: true,
    },
    {
      name: "guestSessionId",
      type: "text",
      unique: true,
      admin: {
        hidden: true,
        description:
          "Identifier for guest customer sessions. Programmatically generated.",
      },
    },
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "productVariant",
          label: "Item",
          type: "relationship",
          relationTo: "product-variants",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          validate: validateQty,
        },
        {
          name: "snapshot",
          type: "group",
          label: "Snapshot",
          admin: {
            description:
              "A snapshot of the product variant at the time it was added to the cart.",
            hidden: true,
          },
          fields: [
            {
              name: "retailPrice",
              type: "number",
              label: "Retail Price",
            },
            {
              name: "inventoryStock",
              type: "number",
              label: "Stock",
            },
            {
              name: "supplierStock",
              type: "number",
              label: "Supplier Stock",
            },
          ],
        },
      ],
    },
    {
      name: "total",
      type: "number",
      label: "Total",
      admin: {
        readOnly: true,
      },
      defaultValue: 0,
      virtual: true,
      hooks: {
        afterRead: [computeTotal],
      },
    },
    {
      name: "lastActiveAt",
      type: "date",
      label: "Last Active At",
      defaultValue: () => new Date().toISOString(),
      admin: {
        readOnly: true,
        description:
          "Timestamp of the last activity on this cart by its ownerOrAdmin.",
      },
      required: true,
    },
  ],
  hooks: {
    beforeChange: [ensureSnapshots, validateCartItems],
    afterChange: [revalidateCache],
  },
}
