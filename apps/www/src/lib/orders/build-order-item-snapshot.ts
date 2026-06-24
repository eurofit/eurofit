import { Product } from "@/payload-types"
import type { VariantDiscount } from "@/types/product-variant"

type PopulatedProductVariant = {
  sku: string
  title: string
  variant?: string | null
  expiryDate?: string | null
  retailPrice?: number | null
  discount?: VariantDiscount | null
  product: Product
}

export type OrderItemDiscount = {
  price: number
  type: "percentage" | "fixed"
  amount: number
}

export type OrderItemSnapshot = {
  sku: string
  variant: string
  price: number
  discount: OrderItemDiscount | null
  title: string
  bbe: string | null
  product: {
    id: string
    title: string
    slug: string
    image: string | null
    brand: string | null
    categories: string[]
  }
}

export function buildOrderItemSnapshot(
  variant: PopulatedProductVariant
): OrderItemSnapshot {
  const product = variant.product
  const discount = variant.discount

  const brand = typeof product.brand === "object" ? product.brand.title : null

  const categories = (product.categories ?? []).flatMap((c) =>
    typeof c === "object" ? [c.title] : []
  )

  return {
    sku: variant.sku,
    variant: variant.variant ?? "",
    price: variant.retailPrice!,
    discount: discount
      ? { price: discount.price, type: discount.type, amount: discount.amount }
      : null,
    title: variant.title,
    bbe: variant.expiryDate ?? null,
    product: {
      id: product.id,
      title: product.title,
      slug: product.slug,
      image: product.supplierImageUrl ?? null,
      brand,
      categories,
    },
  }
}
