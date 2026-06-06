import payloadConfig from "@/payload.config"
import { ActionResult } from "@/types/action-result"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

export async function getTotalBrands(): Promise<
  ActionResult<{ total: number }>
> {
  "use cache"
  cacheTag("brands")
  cacheLife("days")

  try {
    const payload = await getPayload({ config: payloadConfig })

    const { totalDocs: total } = await payload.count({
      collection: "brands",
    })

    return { success: true, data: { total } }
  } catch {
    return { success: false, code: 500, message: "Failed to count brands." }
  }
}
