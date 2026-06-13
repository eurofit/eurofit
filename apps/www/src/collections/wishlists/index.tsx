import { isAdmin } from "@/access/is-admin"
import { userOwned } from "@/access/user-owned"
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
    create: userOwned,
    read: userOwned,
    update: userOwned,
    delete: userOwned,
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
