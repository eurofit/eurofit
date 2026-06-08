"use server"

import { Category } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook } from "payload"

export const revalidateCategoriesTag: CollectionAfterChangeHook<
  Category
> = async ({ doc }) => {
  revalidateTag("categories", "max")
  revalidateTag(`categories:${doc.id}`, "max")
}
