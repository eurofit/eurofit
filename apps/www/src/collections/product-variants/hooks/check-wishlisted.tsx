import { ProductVariant } from "@/payload-types"
import { FieldHook } from "payload"

export const checkIfWishlisted: FieldHook<
  ProductVariant,
  ProductVariant["isWishlisted"],
  ProductVariant
> = async ({ data, req }) => {
  const currentUserId = typeof req.user === "string" ? req.user : req.user?.id

  if (!currentUserId) return false

  const { totalDocs } = await req.payload.count({
    collection: "wishlists",
    where: {
      user: {
        equals: currentUserId,
      },
      productVariant: {
        equals: data?.id,
      },
    },
  })

  return totalDocs > 0
}
