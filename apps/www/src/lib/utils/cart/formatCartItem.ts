import { CartItem } from "@/types/cart"
import { getPayloadImageUrl } from "../payload-image"

export function formatCartItem(item: CartItem) {
  const { productVariant, ...restItem } = item

  if (typeof productVariant !== "object") {
    throw new Error("Cart items are not populated")
  }

  const { product, ...restProductVariant } = productVariant

  if (typeof product !== "object") {
    throw new Error("Cart Items 'product' field is not populated")
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

export type FormattedCartItem = ReturnType<typeof formatCartItem>
