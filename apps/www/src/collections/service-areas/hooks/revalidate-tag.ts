import { ServiceArea } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload"

export const revalidateServiceAreasTag: CollectionAfterChangeHook<
  ServiceArea
> = ({ doc }) => {
  revalidateTag("service-areas", "max")
  revalidateTag(`service-areas:${doc.id}`, "max")
}

export const revalidateServiceAreasTagOnDelete: CollectionAfterDeleteHook = ({
  id,
}) => {
  revalidateTag("service-areas", "max")
  revalidateTag(`service-areas:${id}`, "max")
}
