"use server"

import { Brand } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook } from "payload"

export const revalidateBrandsTag: CollectionAfterChangeHook<Brand> = async ({
  doc,
}) => {
  revalidateTag("brands", "max")
  revalidateTag(`brands:${doc.id}`, "max")
}
