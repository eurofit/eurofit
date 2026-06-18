type VariantInfo = {
  title: string
  variant?: string | null
  sku: string
}

/** Builds the pre-filled WhatsApp message for a "question" about a variant. */
export function buildReviewQuestionMessage(variant: VariantInfo): string {
  const lines = [
    "Hi Eurofit Team,",
    "",
    "I have a question regarding:",
    `*Product*: ${variant.title}`,
    variant.variant ? `*Variant*: ${variant.variant}` : null,
    `*SKU*: ${variant.sku}`,
    "",
    "Question:",
    "",
  ]

  return lines.filter((entry) => entry !== null).join("\n")
}
