import { Media } from "@/payload-types"

export function getPayloadImageUrl(image: string | Media | undefined) {
  if (!image) return null
  if (typeof image === "string") return null

  return image.url ?? null
}
