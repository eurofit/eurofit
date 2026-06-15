import { Package } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

export const revalidatePackagesTag: CollectionAfterChangeHook<Package> = ({
  doc,
}) => {
  revalidateTag("packages", "max")
  revalidateTag(`packages:${doc.id}`, "max")
}

export const revalidatePackagesTagOnDelete: CollectionAfterDeleteHook = ({
  id,
}) => {
  revalidateTag("packages", "max")
  revalidateTag(`packages:${id}`, "max")
}
