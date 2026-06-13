import { Product } from "@/payload-types"

type PopulatedProductVariant = {
  sku: string
  title: string
  variant?: string | null
  expiryDate?: string | null
  retailPrice?: number | null
  product: Product
}

export type OrderItemSnapshot = {
  sku: string
  variant: string
  price: number
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

  return {
    sku: variant.sku,
    variant: variant.variant ?? "",
    price: variant.retailPrice!,
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
