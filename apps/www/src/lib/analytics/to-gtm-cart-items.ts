import { site } from "@/const/site"
import type { FormattedCartItem } from "@/lib/utils/cart/formatCartItem"
import { normalizeVariantDiscount } from "@/lib/utils/discounts/normalize-variant-discount"

/** GA4 supports a five-level item category hierarchy (`item_category`…`5`). */
const GA4_MAX_ITEM_CATEGORIES = 5

/** Google Ads business vertical for the storefront, used for remarketing. */
const GOOGLE_BUSINESS_VERTICAL = "retail"

/** GA4 ecommerce `items[]` entry — the subset of fields the cart can populate. */
export type GTMCartItem = {
  item_id: string
  item_name: string
  affiliation: string
  item_brand?: string
  item_variant?: string
  price: number
  discount?: number
  quantity: number
  index: number
  location_id: string
  google_business_vertical: typeof GOOGLE_BUSINESS_VERTICAL
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
}

/**
 * Spreads the category hierarchy into GA4's positional keys: the first is
 * `item_category`, the rest are `item_category2`…`item_category5`. GA4 ignores
 * levels beyond five, so the list is capped.
 */
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

/**
 * Maps formatted cart lines to the GA4 ecommerce `items` array. Per the GA4 spec
 * `price` is the pre-discount unit price and `discount` is the per-unit monetary
 * saving, so `(price − discount) × quantity` reconciles with the cart's net total.
 * `affiliation` is the storefront name and `item_variant` falls back to the
 * variant's full title when no concise variant label exists.
 */
export function toGTMCartItems(items: FormattedCartItem[]): GTMCartItem[] {
  return items.map((item, index) => {
    const retailPrice = item.retailPrice ?? 0
    const discount = normalizeVariantDiscount(item.discount)
    const variantLabel = item.variant ?? item.title

    return {
      // The variant slug is the feed-matching id: it's always present, human
      // readable, and survives the id/sku churn that comes with scraped data,
      // so it's the most stable join key for Google Ads dynamic remarketing.
      item_id: item.slug,
      item_name: item.product.title,
      affiliation: site.name,
      location_id: site.address.placeId,
      google_business_vertical: GOOGLE_BUSINESS_VERTICAL,
      ...(item.product.brand ? { item_brand: item.product.brand } : {}),
      ...(variantLabel ? { item_variant: variantLabel } : {}),
      ...toItemCategoryFields(item.product.categories),
      price: retailPrice,
      ...(discount ? { discount: retailPrice - discount.price } : {}),
      quantity: item.quantity,
      index,
    }
  })
}
