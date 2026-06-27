import type { Discount } from "@/payload-types"
import { revalidateTag } from "next/cache"
import type { CollectionAfterChangeHook } from "payload"

const toIds = (variants: Discount["eligibleVariants"]): string[] =>
  (variants ?? []).map((v) => (typeof v === "object" ? v.id : v))

export const revalidateEligibleVariants: CollectionAfterChangeHook<
  Discount
> = ({ doc, previousDoc }) => {
  const prevIds = new Set(toIds(previousDoc.eligibleVariants))
  const nextIds = new Set(toIds(doc.eligibleVariants))

  for (const id of prevIds) {
    if (!nextIds.has(id)) revalidateTag(`product-variants:${id}`, "max")
  }
  for (const id of nextIds) {
    if (!prevIds.has(id)) revalidateTag(`product-variants:${id}`, "max")
  }
}
