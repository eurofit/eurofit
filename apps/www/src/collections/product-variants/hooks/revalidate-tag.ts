import { ProductVariant } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

export const revalidateProductVariantTag: CollectionAfterChangeHook<
  ProductVariant
> = ({ doc }) => {
  revalidateTag("product-variants:total")
  revalidateTag("product-variants-feed")
  revalidateTag(`product-variants:${doc.id}`)
  return doc
}

export const revalidateProductVariantTagOnDelete: CollectionAfterDeleteHook = ({
  id,
}) => {
  revalidateTag("product-variants:total")
  revalidateTag("product-variants-feed")
  revalidateTag(`product-variants:${id}`)
}
