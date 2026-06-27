import "server-only"

import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

export const getPage = async (slug: string) => {
  "use cache"

  cacheTag(`pages:${slug}`)
  cacheLife("hours")

  const payload = await getPayload({ config })

  const {
    docs: [page],
  } = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    populate: {
      "product-variants": {
        slug: true,
        title: true,
        images: true,
        retailPrice: true,
        discount: true,
        product: true,
      },
      products: {
        slug: true,
        title: true,
        images: true,
        supplierImageUrl: true,
      },
    },
    limit: 1,
    pagination: false,
  })

  return page ?? null
}
