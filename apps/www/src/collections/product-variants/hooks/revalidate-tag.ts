import { ProductVariant } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

export const revalidateProductVariantTag: CollectionAfterChangeHook<
  ProductVariant
> = ({ doc }) => {
  revalidateTag("product-variants:total", "max")
  revalidateTag("product-variants-feed", "max")
  revalidateTag(`product-variants:${doc.id}`, "max")
  return doc
}

export const revalidateProductVariantTagOnDelete: CollectionAfterDeleteHook = ({
  id,
}) => {
  revalidateTag("product-variants:total", "max")
  revalidateTag("product-variants-feed", "max")
  revalidateTag(`product-variants:${id}`, "max")
}
