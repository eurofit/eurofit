"use server"

import { ServiceArea } from "@/payload-types"
import { revalidateTag } from "next/cache"
import { CollectionAfterChangeHook } from "payload"

export const revalidateServiceAreasTag: CollectionAfterChangeHook<
  ServiceArea
> = async ({ doc }) => {
  revalidateTag("service-areas", "max")
  revalidateTag(`service-areas:${doc.id}`, "max")
}
