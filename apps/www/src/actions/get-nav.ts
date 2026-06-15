import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

export const getNav = async () => {
  "use cache"

  cacheTag("nav")
  cacheLife("hours")

  const payload = await getPayload({
    config,
  })

  const nav = await payload.findGlobal({
    slug: "nav",
  })

  return nav.items
}
