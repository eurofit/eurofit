import { site } from "@/const/site"

const GA4_MAX_ITEM_CATEGORIES = 5
const GOOGLE_BUSINESS_VERTICAL = "retail"

export type GTMWishlistItem = {
  item_id: string
  item_name: string
  affiliation: string
  item_brand?: string
  item_variant?: string
  price: number
  discount?: number
  quantity: 1
  index: number
  location_id: string
  google_business_vertical: typeof GOOGLE_BUSINESS_VERTICAL
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
}

export type WishlistGTMInput = {
  slug: string
  productTitle: string
  price: number | null
  discountedPrice?: number | null
  brand?: string | null
  variantLabel?: string | null
  categories?: string[]
}

function toItemCategoryFields(categories: string[]): Record<string, string> {
  return categories
    .slice(0, GA4_MAX_ITEM_CATEGORIES)
    .reduce<Record<string, string>>((fields, title, position) => {
      const key =
        position === 0 ? "item_category" : `item_category${position + 1}`
      fields[key] = title
      return fields
    }, {})
}

export function toGTMWishlistItem(
  input: WishlistGTMInput,
  index = 0
): GTMWishlistItem {
  const retailPrice = input.price ?? 0
  const discountedPrice = input.discountedPrice ?? null
  const discountAmount =
    discountedPrice !== null && discountedPrice < retailPrice
      ? retailPrice - discountedPrice
      : undefined

  return {
    item_id: input.slug,
    item_name: input.productTitle,
    affiliation: site.name,
    location_id: site.address.placeId,
    google_business_vertical: GOOGLE_BUSINESS_VERTICAL,
    ...(input.brand ? { item_brand: input.brand } : {}),
    ...(input.variantLabel ? { item_variant: input.variantLabel } : {}),
    ...toItemCategoryFields(input.categories ?? []),
    price: retailPrice,
    ...(discountAmount !== undefined ? { discount: discountAmount } : {}),
    quantity: 1,
    index,
  }
}

export function toGTMWishlistEventValue(item: GTMWishlistItem): number {
  return item.price - (item.discount ?? 0)
}
