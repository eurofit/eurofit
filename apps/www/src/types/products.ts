import { ProductVariant } from "./product-variant"

export type Product = {
  id: string
  slug: string
  title: string
  origin?: string | null
  image?: string | null
  productVariants: ProductVariant[]
}
