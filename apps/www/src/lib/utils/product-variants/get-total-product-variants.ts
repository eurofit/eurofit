import "server-only"

import payloadConfig from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

export async function getTotalProductLines() {
  "use cache"
  cacheTag("product-lines")
  cacheLife("days")

  const payload = await getPayload({
    config: payloadConfig,
  })

  const { totalDocs: totalProductLines } = await payload.count({
    collection: "product-variants",
  })

  return totalProductLines
}
