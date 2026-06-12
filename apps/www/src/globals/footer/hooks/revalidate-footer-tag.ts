import { revalidateTag } from "next/cache"
import { GlobalAfterChangeHook } from "payload"

export const revalidateFooterTag: GlobalAfterChangeHook = ({ doc }) => {
  revalidateTag("footer", "max")
  return doc
}
