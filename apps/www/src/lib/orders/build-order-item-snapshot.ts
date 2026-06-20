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
  }
}

export function buildOrderItemSnapshot(
  variant: PopulatedProductVariant
): OrderItemSnapshot {
  const product = variant.product
  const discount = variant.discount

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
    },
  }
}
