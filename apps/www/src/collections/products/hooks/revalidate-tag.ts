import { Product } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

export const revalidateProductTag: CollectionAfterChangeHook<Product> = ({
  doc,
}) => {
  revalidateTag("products")
  revalidateTag(`products:${doc.id}`)
  return doc
}

export const revalidateProductTagOnDelete: CollectionAfterDeleteHook = ({
  id,
}) => {
  revalidateTag("products")
  revalidateTag(`products:${id}`)
}
