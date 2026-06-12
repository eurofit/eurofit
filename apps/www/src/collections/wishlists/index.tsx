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
  fields: [
    {
      name: "customer",
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
      fields: ["customer", "productVariant"],
      unique: true,
    },
  ],
}
