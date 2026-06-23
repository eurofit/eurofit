import { site } from "@/const/site"

/** Google Merchant Center `availability` values we map our stock state onto. */
export type MerchantAvailability = "in_stock" | "out_of_stock" | "backorder"

/**
 * A single Google Merchant Center product offer. `id` is the variant slug so it
 * matches the GA4 `item_id` we send, keeping dynamic remarketing joins intact.
 */
export type MerchantFeedItem = {
  id: string
  title: string
  link: string
  price: number
  availability: MerchantAvailability
  imageLink?: string
  brand?: string
  gtin?: string
  productType?: string
}

/** ISO 4217 currency for every offer (matches the storefront). */
const FEED_CURRENCY = "KES"

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function tag(name: string, value: string): string {
  return `<${name}>${escapeXml(value)}</${name}>`
}

function buildItemXml(item: MerchantFeedItem): string {
  const tags = [
    tag("g:id", item.id),
    tag("g:title", item.title),
    tag("g:link", item.link),
    tag("g:price", `${item.price} ${FEED_CURRENCY}`),
    tag("g:availability", item.availability),
    tag("g:condition", "new"),
  ]

  if (item.imageLink) tags.push(tag("g:image_link", item.imageLink))
  if (item.brand) tags.push(tag("g:brand", item.brand))
  if (item.gtin) tags.push(tag("g:gtin", item.gtin))
  if (item.productType) tags.push(tag("g:product_type", item.productType))

  return `<item>${tags.join("")}</item>`
}

/**
 * Serializes feed items into an RSS 2.0 product feed that Google Merchant Center
 * can fetch on a schedule. Each `g:id` is the variant slug, so the feed offer id,
 * the storefront URL, and the GA4 `item_id` all share one stable key.
 */
export function buildGoogleMerchantXml(items: MerchantFeedItem[]): string {
  const channel =
    tag("title", `${site.name} Product Feed`) +
    tag("link", site.url) +
    tag("description", site.description) +
    items.map(buildItemXml).join("")

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">` +
    `<channel>${channel}</channel>` +
    `</rss>`
  )
}
