import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook } from "payload"

export const revalidatePageTag: CollectionAfterChangeHook = ({ doc }) => {
  revalidateTag(`pages:${doc.slug}`, "max")
  return doc
}
