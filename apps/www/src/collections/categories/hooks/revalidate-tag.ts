import { Category } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

export const revalidateCategoriesTag: CollectionAfterChangeHook<Category> = ({
  doc,
}) => {
  revalidateTag("categories", "max")
  revalidateTag(`categories:${doc.id}`, "max")
}

export const revalidateCategoriesTagOnDelete: CollectionAfterDeleteHook = ({
  id,
}) => {
  revalidateTag("categories", "max")
  revalidateTag(`categories:${id}`, "max")
}
