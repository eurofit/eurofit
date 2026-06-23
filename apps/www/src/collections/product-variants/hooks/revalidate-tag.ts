import { ProductVariant } from "@/payload-types"
import { updateTag } from "next/cache"
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

export const revalidateProductVariantTag: CollectionAfterChangeHook<
  ProductVariant
> = ({ doc }) => {
  updateTag("product-variants:total")
  updateTag("product-variants-feed")
  updateTag(`product-variants:${doc.id}`)
  return doc
}

export const revalidateProductVariantTagOnDelete: CollectionAfterDeleteHook = ({
  id,
}) => {
  updateTag("product-variants:total")
  updateTag("product-variants-feed")
  updateTag(`product-variants:${id}`)
}
