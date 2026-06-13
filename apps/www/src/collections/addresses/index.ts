import { isAdmin } from "@/access/is-admin"
import { userOwned } from "@/access/user-owned"
import { titles } from "@/const/titles"
import { CollectionConfig } from "payload"
import { ensureSingleDefaultAddress } from "./hooks/ensure-single-default-address"

export const addresses: CollectionConfig = {
  slug: "addresses",
  labels: {
    singular: "Address",
    plural: "Addresses",
  },
  access: {
    create: userOwned,
    read: userOwned,
    update: userOwned,
    delete: userOwned,
    admin: isAdmin,
  },
  admin: {
    description: "Customer delivery addresses.",
  },

  fields: [
    /**
     * OWNERSHIP
     */
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
    },

    /**
     * CONTACT PERSON
     */
    {
      name: "title",
      type: "select",
      options: titles,
      required: true,
    },
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      required: true,
    },

    /**
     * ADDRESS IDENTITY
     */
    {
      name: "label",
      type: "text",
      admin: {
        description:
          "Short name to identify this address. Example: Home, Work, Shop, Warehouse, Cargo.",
      },
    },

    /**
     * CORE ADDRESS
     */
    {
      name: "line1",
      type: "text",
      required: true,
      admin: {
        description:
          "Primary address details. Example: Building name, house number, or plot number.",
      },
    },
    {
      name: "line2",
      type: "text",
      admin: {
        description:
          "Optional extra details. Example: Apartment number, floor, or suite.",
      },
    },
    {
      name: "area",
      type: "text",
      admin: {
        description:
          "Area or neighborhood. Example: Eastleigh, Kibera, Embakasi, Westlands.",
      },
    },
    {
      name: "landmark",
      type: "text",
      admin: {
        description:
          "Landmark or direction to the address. Example: Near the main gate, Behind the school.",
      },
    },

    /**
     * LOCATION (ADMINISTRATIVE)
     */
    {
      name: "city",
      type: "text",
      required: true,
      admin: {
        description: "City or town. Example: Nairobi, Thika, Nakuru.",
      },
    },
    {
      name: "county",
      type: "text",
      required: true,
      admin: {
        description: "County name. Example: Nairobi, Kiambu, Mombasa.",
      },
    },
    {
      name: "country",
      type: "text",
      required: true,
      defaultValue: "Kenya",
      admin: {
        description: "Country where this address is located.",
      },
    },
    {
      name: "postalCode",
      type: "text",
      required: true,
      admin: {
        description: "Postal code for the area. Example: 00100, 00200.",
      },
    },

    /**
     * DELIVERY INSTRUCTIONS
     */
    {
      name: "note",
      type: "textarea",
      admin: {
        description:
          "Extra delivery instructions. Example: Call when at the gate, Ask for caretaker.",
      },
    },

    /**
     * DEFAULT ADDRESS
     */
    {
      name: "isDefault",
      type: "checkbox",
      defaultValue: false,
      required: true,
      admin: {
        description: "Set this as the user’s default delivery address.",
      },
    },
  ],

  hooks: {
    beforeChange: [ensureSingleDefaultAddress],
  },
}
