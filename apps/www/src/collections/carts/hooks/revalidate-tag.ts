import { Cart } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook } from "payload"

export const revalidateCache: CollectionAfterChangeHook<Cart> = ({ doc }) => {
  revalidateTag(`cart:${doc.id}`)
  revalidateTag(`cart:${doc.guestSessionId}`)

  return doc
}
