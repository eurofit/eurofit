import "server-only"

import { ServiceAreaDetail } from "@/types/service-area"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

type GetServiceAreaArgs = {
  slug: string
}

export async function getServiceArea({
  slug,
}: GetServiceAreaArgs): Promise<ServiceAreaDetail | null> {
  "use cache"
  cacheTag("service-areas")
  cacheLife("hours")

  const payload = await getPayload({ config })

  const { docs: serviceAreas } = await payload.find({
    collection: "service-areas",
    where: {
      slug: { equals: slug },
      isActive: { equals: true },
    },
    select: {
      title: true,
      slug: true,
      deliveryTime: true,
    },
    limit: 1,
    pagination: false,
  })

  const serviceArea = serviceAreas[0]

  if (!serviceArea) return null

  cacheTag(`service-areas:${serviceArea.id}`)

  return {
    title: serviceArea.title,
    slug: serviceArea.slug ?? "",
    deliveryTime: {
      minDays: serviceArea.deliveryTime.minDays,
      maxDays: serviceArea.deliveryTime.maxDays,
    },
  }
}
