import "server-only"

import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

export type ServiceAreaSummary = {
  slug: string
  title: string
  updatedAt: string
}

export async function getAllServiceAreas(): Promise<ServiceAreaSummary[]> {
  "use cache"
  cacheTag("service-areas")
  cacheLife("hours")

  const payload = await getPayload({ config })

  const { docs: serviceAreas } = await payload.find({
    collection: "service-areas",
    where: {
      isActive: { equals: true },
    },
    select: {
      slug: true,
      title: true,
      updatedAt: true,
    },
    sort: "title",
    limit: 0,
    pagination: false,
  })

  return serviceAreas.map((area) => ({
    slug: area.slug ?? "",
    title: area.title,
    updatedAt: area.updatedAt,
  }))
}
