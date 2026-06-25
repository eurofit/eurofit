"use client"

import { GTMEventTracker } from "@/components/analytics/gtm-event-tracker"
import { Facebook } from "@/components/icons/facebook"
import { Twitter } from "@/components/icons/twitter"
import { Whatsapp } from "@/components/icons/whatsapp"
import { CountdownTimerBlock } from "@/components/timer/countdown-timer-block"
import {
  GTM_ECOMMERCE_CURRENCY,
  GTM_ECOMMERCE_EVENT,
} from "@/const/gtm-ecommerce-events"
import { site } from "@/const/site"
import { ProductAnalyticsProvider } from "@/contexts/product-analytics-context"
import {
  toGTMItem,
  toGTMItemsValue,
} from "@/lib/analytics/ecommerce/to-gtm-item"
import { sendShareEvent } from "@/lib/analytics/send-share-event"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import type { VariantDiscount } from "@/types/product-variant"
import { Badge } from "@eurofit/ui/components/badge"
import { Button } from "@eurofit/ui/components/button"
import { Separator } from "@eurofit/ui/components/separator"
import { Flame, ShieldCheck, Star } from "lucide-react"
import Link from "next/link"
import pluralize from "pluralize-esm"
import { ProductDetailCartActions } from "./product-detail-cart-actions"
import { VariantPrice } from "./variant-price"
import { WishlistButton } from "./wishlist-button"

export type ProductInfoVariant = {
  id: string
  sku: string
  slug: string
  title: string
  productTitle: string
  categories: string[]
  brand: { title: string; slug: string } | null
  price: number | null
  discount: VariantDiscount | null
  inStock: boolean
  isBackorder: boolean
  stock: number
  variant: string | null
  averageRating: number
  totalRatings: number
}

interface ProductInfoProps {
  variant: ProductInfoVariant
}

export function ProductInfo({ variant }: ProductInfoProps) {
  const {
    id,
    sku,
    slug,
    title,
    productTitle,
    categories,
    brand,
    price,
    discount,
    inStock,
    isBackorder,
    stock,
    variant: variantLabel,
    averageRating,
    totalRatings,
  } = variant

  const gtmItem = toGTMItem({
    sku,
    productTitle,
    price,
    discountedPrice: discount?.price ?? null,
    brand: brand?.title ?? null,
    variantLabel: variantLabel ?? null,
    categories,
  })

  const productUrl = `${site.url}/product-variants/${slug}`
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${productUrl}`)}`,
  }

  return (
    <div className="flex flex-col justify-start gap-6">
      <GTMEventTracker
        ecommerce
        event={{
          event: GTM_ECOMMERCE_EVENT.VIEW_ITEM,
          ecommerce: {
            currency: GTM_ECOMMERCE_CURRENCY,
            value: toGTMItemsValue([gtmItem]),
            items: [gtmItem],
          },
        }}
      />
      {/* Header with Wishlist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <Flame className="fill-current" />
              Trending
            </Badge>
            <Badge variant="secondary">Best seller</Badge>
          </div>
          <WishlistButton variantId={id} gtmItem={gtmItem} />
        </div>
        <h1 className="text-xl font-bold text-pretty text-foreground md:text-3xl md:leading-9 md:text-balance">
          {title}
        </h1>
        {/* Brand */}
        {brand && (
          <Link
            href={`/brands/${brand.slug}`}
            className="inline-block text-sm text-primary underline-offset-4 hover:underline"
          >
            Visit the {brand.title} store
          </Link>
        )}
      </div>

      {/* Rating and Stock */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`size-4 ${
                  i < Math.round(averageRating)
                    ? "fill-orange-400 text-orange-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {totalRatings > 0
              ? `${averageRating.toFixed(1)} (${totalRatings} verified ${pluralize("rating", totalRatings)})`
              : "No ratings yet"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          {inStock ? (
            <>
              <span className="size-2 rounded-full bg-green-600" />
              <span className="text-green-700 dark:text-green-500">
                {formatWithCommas(stock)} in stock
                {isBackorder && (
                  <span className="font-normal text-muted-foreground">
                    &nbsp;(backorder)
                  </span>
                )}
              </span>
            </>
          ) : (
            <>
              <span className="size-2 rounded-full bg-destructive" />
              <span className="text-destructive">Out of stock</span>
            </>
          )}
        </div>
      </div>

      {/* Pricing Section */}
      {price != null && (
        <div className="space-y-3">
          <VariantPrice price={price} discount={discount} size="lg" />
          {discount?.endDate && (
            <CountdownTimerBlock endDate={discount.endDate} />
          )}
        </div>
      )}

      {/* Variation Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Variation
        </span>
        <Badge variant="secondary">{variantLabel}</Badge>
      </div>

      {/* Add to Cart Button */}
      <ProductAnalyticsProvider brand={brand?.title} categories={categories}>
        <ProductDetailCartActions
          variant={{
            id,
            stock,
            sku,
            slug,
            title,
            variant: variantLabel,
            price,
          }}
          inStock={inStock}
        />
      </ProductAnalyticsProvider>

      {/* Trust */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="size-4" aria-hidden="true" />
        Fast &amp; secure payments
      </div>

      <Separator />

      {/* Share */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Share this product
        </h2>
        <ul className="flex items-center gap-2">
          <li>
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              asChild
            >
              <a
                href={shareUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  sendShareEvent({ method: "Facebook", itemId: sku })
                }
              >
                <Facebook />
                <span className="sr-only">Share on Facebook</span>
              </a>
            </Button>
          </li>
          <li>
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              asChild
            >
              <a
                href={shareUrls.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  sendShareEvent({ method: "Twitter", itemId: sku })
                }
              >
                <Twitter />
                <span className="sr-only">Share on Twitter</span>
              </a>
            </Button>
          </li>
          <li>
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full"
              asChild
            >
              <a
                href={shareUrls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  sendShareEvent({ method: "WhatsApp", itemId: sku })
                }
              >
                <Whatsapp />
                <span className="sr-only">Share on WhatsApp</span>
              </a>
            </Button>
          </li>
        </ul>
      </section>
    </div>
  )
}
