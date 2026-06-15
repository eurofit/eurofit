import { revalidateTag } from "next/cache"
import { GlobalAfterChangeHook } from "payload"

export const revalidateNavTag: GlobalAfterChangeHook = ({ doc }) => {
  revalidateTag("nav", "max")
  return doc
}
