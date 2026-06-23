import { site } from "@/const/site"
import type { FormattedCartItem } from "@/lib/utils/cart/formatCartItem"
import { normalizeVariantDiscount } from "@/lib/utils/discounts/normalize-variant-discount"

/** GA4 supports a five-level item category hierarchy (`item_category`…`5`). */
const GA4_MAX_ITEM_CATEGORIES = 5

/** Google Ads business vertical for the storefront, used for remarketing. */
const GOOGLE_BUSINESS_VERTICAL = "retail"

/** GA4 ecommerce `items[]` entry — the subset of fields the storefront populates. */
export type GTMItem = {
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
 * Flat, source-agnostic input for {@link toGTMItem}. `discountedPrice` is the net
 * (post-discount) unit price, `quantity` defaults to `1` for single-item events
 * (wishlist, `view_item`) and is set explicitly for cart events.
 */
export type GTMItemInput = {
  sku: string
  productTitle: string
  price: number | null
  discountedPrice?: number | null
  brand?: string | null
  variantLabel?: string | null
  categories?: string[]
  quantity?: number
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
 * Maps a flat input to a GA4 ecommerce `items[]` entry. Per the GA4 spec `price`
 * is the pre-discount unit price and `discount` is the per-unit monetary saving,
 * so `(price − discount) × quantity` reconciles with the line's net total.
 * `affiliation` is the storefront name; `quantity` defaults to `1`.
 */
export function toGTMItem(input: GTMItemInput, index = 0): GTMItem {
  const retailPrice = input.price ?? 0
  const discountedPrice = input.discountedPrice ?? null
  const discountAmount =
    discountedPrice !== null && discountedPrice < retailPrice
      ? retailPrice - discountedPrice
      : undefined

  return {
    item_id: input.sku,
    item_name: input.productTitle,
    affiliation: site.name,
    location_id: site.address.placeId,
    google_business_vertical: GOOGLE_BUSINESS_VERTICAL,
    ...(input.brand ? { item_brand: input.brand } : {}),
    ...(input.variantLabel ? { item_variant: input.variantLabel } : {}),
    ...toItemCategoryFields(input.categories ?? []),
    price: retailPrice,
    ...(discountAmount !== undefined ? { discount: discountAmount } : {}),
    quantity: input.quantity ?? 1,
    index,
  }
}

/** Maps flat inputs to the GA4 ecommerce `items` array. */
export function toGTMItems(inputs: GTMItemInput[]): GTMItem[] {
  return inputs.map(toGTMItem)
}

/**
 * Sums the net (post-discount) value of GA4 items: `Σ (price − discount) × quantity`.
 * Used as the `value` for ecommerce events so it reconciles with the items;
 * single-item events (wishlist, `view_item`) pass `[item]`.
 */
export function toGTMItemsValue(items: GTMItem[]): number {
  return items.reduce(
    (total, item) =>
      total + (item.price - (item.discount ?? 0)) * item.quantity,
    0
  )
}

/**
 * Adapts a formatted cart line to {@link GTMItemInput}. `variantLabel` falls back
 * to the variant's full title when no concise label exists, and the structured
 * Payload discount is normalized down to its net unit price.
 */
export function formattedCartItemToGTMInput(
  item: FormattedCartItem
): GTMItemInput {
  return {
    sku: item.sku,
    productTitle: item.product.title,
    price: item.retailPrice ?? 0,
    discountedPrice: normalizeVariantDiscount(item.discount)?.price ?? null,
    brand: item.product.brand ?? null,
    variantLabel: item.variant ?? item.title,
    categories: item.product.categories,
    quantity: item.quantity,
  }
}
