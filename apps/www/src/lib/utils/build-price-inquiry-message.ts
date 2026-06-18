import type { ProductVariant } from "@/types/product-variant"

/** Builds the pre-filled WhatsApp message for a "price inquiry" on a variant. */
export function buildPriceInquiryMessage(
  variant: Pick<ProductVariant, "title" | "variant" | "sku">
): string {
  const lines = [
    "Hello Eurofit Team,",
    "",
    "I would like to inquire about the price for this product:",
    "",
    `*Product*: ${variant.title}`,
    variant.variant ? `*Variant*: ${variant.variant}` : null,
    `*SKU*: ${variant.sku}`,
    "",
    "Thank you.",
  ]

  return lines.filter((entry) => entry !== null).join("\n")
}
