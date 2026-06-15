import { Order } from "@/payload-types"
import { getPayloadImageUrl } from "../payload-image"

export function formatOrderItem(item: Order["items"][number]) {
  const { productVariant, ...restItem } = item

  if (typeof productVariant !== "object") {
    throw new Error("Order items are not populated")
  }

  const { product, ...restProductVariant } = productVariant

  if (typeof product !== "object") {
    throw new Error("Order Items 'product' field is not populated")
  }

  return {
    product: {
      id: product.id,
      slug: product.slug,
      title: product.title,
      image:
        getPayloadImageUrl(product.images?.[0]) ??
        product.supplierImageUrl ??
        null,
    },
    ...restItem,
    ...restProductVariant,
  }
}
