export type WishlistItem = {
  id: string
  variantId: string
  title: string
  productTitle: string
  slug: string
  price: number | null
  discountedPrice: number | null
  image: string | null
  isOutOfStock: boolean
  brand?: string
  categories: string[]
}
