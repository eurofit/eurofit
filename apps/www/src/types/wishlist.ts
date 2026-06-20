export type WishlistItem = {
  id: string
  variantId: string
  title: string
  slug: string
  price: number | null
  discountedPrice: number | null
  image: string | null
  isOutOfStock: boolean
}
