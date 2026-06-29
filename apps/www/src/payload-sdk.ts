import { site } from "@/const/site"
import type { Config } from "@/payload-types"
import { PayloadSDK } from "@payloadcms/sdk"

export const payloadSDK = new PayloadSDK<Config>({
  baseURL: site.url + "/payload/api",
  baseInit: { credentials: "include" },
})
