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
      products: {
        slug: true,
        title: true,
        supplierImageUrl: true,
      },
    },
    limit: 1,
    pagination: false,
  })

  return page ?? null
}
