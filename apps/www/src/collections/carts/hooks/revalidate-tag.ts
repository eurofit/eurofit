import { Cart } from "@/payload-types"
import { updateTag } from "next/cache"
import { CollectionAfterChangeHook } from "payload"

export const revalidateCache: CollectionAfterChangeHook<Cart> = ({ doc }) => {
  updateTag(`cart:${doc.id}`)
  updateTag(`cart:${doc.guestSessionId}`)

  return doc
}
