import { Product } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

export const revalidateProductTag: CollectionAfterChangeHook<Product> = ({
  doc,
}) => {
  revalidateTag("products", "max")
  revalidateTag(`products:${doc.id}`, "max")
  return doc
}

export const revalidateProductTagOnDelete: CollectionAfterDeleteHook = ({
  id,
}) => {
  revalidateTag("products", "max")
  revalidateTag(`products:${id}`, "max")
}
