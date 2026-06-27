import { Category } from "@/payload-types"
import { CartItem } from "@/types/cart"
import { getPayloadImageUrl } from "../payload-image"
import { resolveAvailableStock } from "../stock/resolve-available-stock"

export function formatCartItem(item: CartItem) {
  const { productVariant, ...restItem } = item

  if (typeof productVariant !== "object") {
    throw new Error("Cart items are not populated")
  }

  const { product, ...restProductVariant } = productVariant

  if (typeof product !== "object") {
    throw new Error("Cart Items 'product' field is not populated")
  }

  const brand =
    product.brand && typeof product.brand === "object"
      ? product.brand.title
      : undefined

  const categories = (product.categories ?? [])
    .filter(
      (category: string | Category): category is Category =>
        typeof category === "object"
    )
    .map((category: Category) => category.title)

  return {
    product: {
      id: product.id,
      slug: product.slug,
      title: product.title,
      brand,
      categories,
      image:
        getPayloadImageUrl(product.images?.[0]) ??
        product.supplierImageUrl ??
        null,
    },
    ...restItem,
    ...restProductVariant,
    stock: resolveAvailableStock(
      restProductVariant.stock,
      restProductVariant.supplierStock
    ),
  }
}

export type FormattedCartItem = ReturnType<typeof formatCartItem>
