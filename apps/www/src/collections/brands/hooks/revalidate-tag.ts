import { Brand } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

export const revalidateBrandsTag: CollectionAfterChangeHook<Brand> = ({
  doc,
}) => {
  revalidateTag("brands", "max")
  revalidateTag(`brands:${doc.id}`, "max")
}

export const revalidateBrandsTagOnDelete: CollectionAfterDeleteHook = ({
  id,
}) => {
  revalidateTag("brands", "max")
  revalidateTag(`brands:${id}`, "max")
}
