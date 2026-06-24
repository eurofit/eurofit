import "server-only"

import config from "@payload-config"
import { getPayload } from "payload"
import * as z from "zod"

export async function getProductVariantById(unSafeId: string) {
  const id = z.string().parse(unSafeId)

  const payload = await getPayload({ config })

  const productLine = await payload.findByID({
    collection: "product-variants",
    id,
    select: {
      slug: true,
      title: true,
    },
  })

  return productLine
}
