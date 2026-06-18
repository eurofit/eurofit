import { isAdmin } from "@/access/is-admin"
import { CollectionConfig } from "payload"

export const wishlists: CollectionConfig = {
  slug: "wishlists",
  typescript: {
    interface: "Wishlist",
  },
  labels: {
    singular: "Wishlist",
    plural: "Wishlists",
  },
  access: {
    create: ownerOrAdmin,
    read: ownerOrAdmin,
    update: ownerOrAdmin,
    delete: ownerOrAdmin,
    admin: isAdmin,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      required: true,
    },
    {
      name: "productVariant",
      type: "relationship",
      relationTo: "product-variants",
      hasMany: false,
      required: true,
    },
  ],
  indexes: [
    {
      fields: ["user", "productVariant"],
      unique: true,
    },
  ],
}
