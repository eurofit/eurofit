import { Product } from "@/payload-types"
import { updateTag } from "next/cache"
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

export const revalidateProductTag: CollectionAfterChangeHook<Product> = ({
  doc,
}) => {
  updateTag("products")
  updateTag(`products:${doc.id}`)
  return doc
}

export const revalidateProductTagOnDelete: CollectionAfterDeleteHook = ({
  id,
}) => {
  updateTag("products")
  updateTag(`products:${id}`)
}
