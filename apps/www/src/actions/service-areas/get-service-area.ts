import "server-only"

import {
  ServiceAreaDetail,
  ServiceAreaShippingRate,
} from "@/types/service-area"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

type GetServiceAreaArgs = {
  slug: string
}

type RawShippingRate = {
  package?: string | { title?: string | null; maxWeight?: number | null } | null
  price?: number | null
}

/** Maps populated shipping rates to display-ready pairs, sorted cheapest first. */
function resolveShippingRates(
  rates: RawShippingRate[] | null | undefined
): ServiceAreaShippingRate[] {
  return (rates ?? [])
    .filter(
      (rate): rate is RawShippingRate & { price: number } =>
        typeof rate.price === "number"
    )
    .map((rate) => {
      const populatedPackage =
        rate.package && typeof rate.package === "object" ? rate.package : null

      return {
        packageTitle: populatedPackage?.title ?? "Standard",
        maxWeight: populatedPackage?.maxWeight ?? null,
        price: rate.price,
      }
    })
    .sort((a, b) => a.price - b.price)
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
      shippingRates: true,
    },
    populate: {
      packages: { title: true, maxWeight: true },
    },
    limit: 1,
    pagination: false,
  })

  const serviceArea = serviceAreas[0]

  if (!serviceArea) return null

  cacheTag(`service-areas:${serviceArea.id}`)

  const shippingRates = resolveShippingRates(serviceArea.shippingRates)
  const lowestShippingRate = shippingRates[0]?.price ?? null

  return {
    title: serviceArea.title,
    slug: serviceArea.slug ?? "",
    deliveryTime: {
      minDays: serviceArea.deliveryTime.minDays,
      maxDays: serviceArea.deliveryTime.maxDays,
    },
    lowestShippingRate,
    shippingRates,
  }
}
