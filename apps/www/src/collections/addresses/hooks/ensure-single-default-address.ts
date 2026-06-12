import { Address } from "@/payload-types"
import { type CollectionBeforeChangeHook } from "payload"

export const ensureSingleDefaultAddress: CollectionBeforeChangeHook<
  Address
> = async ({ data, req, originalDoc }) => {
  const isDefault = data.isDefault ?? originalDoc?.isDefault

  if (isDefault) {
    await req.payload.update({
      collection: "addresses",
      where: {
        user: { equals: data.user },
        isDefault: { equals: true },
      },
      data: { isDefault: false },
      req,
      user: req.user,
    })

    return data
  }

  const { docs: existingDefaultAddresses } = await req.payload.find({
    collection: "addresses",
    where: {
      user: { equals: data.user },
      isDefault: { equals: true },
    },
    limit: 1,
    pagination: false,
    depth: 0,
    req,
    user: req.user,
  })

  if (existingDefaultAddresses.length === 0) {
    data.isDefault = true
  }

  return data
}
