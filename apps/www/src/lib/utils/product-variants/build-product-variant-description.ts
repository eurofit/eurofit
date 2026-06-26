import { site } from "@/const/site"
import { ProductDetail } from "@/lib/utils/product-variants/get-product-variant-by-slug"

const MAX_LENGTH = 150

function truncateAtWord(text: string): string {
  if (text.length <= MAX_LENGTH) return text
  const trimmed = text.slice(0, MAX_LENGTH)
  const lastSpace = trimmed.lastIndexOf(" ")
  return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed) + "…"
}

export function buildProductVariantDescription(variant: ProductDetail): string {
  const name = variant.detailTitle ?? variant.title
  const parts: string[] = [`Buy original ${name}.`]

  if (variant.barcode) parts.push(`Barcode: ${variant.barcode}.`)

  const variantDetails = [variant.flavorColor, variant.size].filter(Boolean)
  if (variantDetails.length > 0) parts.push(`${variantDetails.join(", ")}.`)

  if (variant.retailPrice != null) {
    parts.push(`KSh ${variant.retailPrice.toLocaleString()}.`)
  }

  parts.push(`Fast delivery across Kenya. Order from ${site.name}.`)

  return truncateAtWord(parts.join(" "))
}
