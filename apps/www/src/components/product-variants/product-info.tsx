import { GTMEventTracker } from "@/components/analytics/gtm-event-tracker"
import { Facebook } from "@/components/icons/facebook"
import { Twitter } from "@/components/icons/twitter"
import { Whatsapp } from "@/components/icons/whatsapp"
import { CountdownTimerBlock } from "@/components/timer/countdown-timer-block"
import {
  GTM_ECOMMERCE_CURRENCY,
  GTM_ECOMMERCE_EVENT,
} from "@/const/gtm-ecommerce-events"
import {
  toGTMItem,
  toGTMItemsValue,
} from "@/lib/analytics/ecommerce/to-gtm-item"
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

interface ProductInfoProps {
  currentUserId: string | undefined
  id: string
  sku: string
  title: string
  productTitle?: string
  variantSlug?: string
  categories?: string[]
  brand: {
    title: string
    slug: string
  } | null
  price?: number | null
  discount: VariantDiscount | null
  inStock: boolean
  isPreorder: boolean
  stock: number
  variant?: string | null
  isWishlisted: boolean
  averageRating: number
  totalRatings: number
}

export function ProductInfo({
  currentUserId,
  id,
  sku,
  title,
  productTitle,
  variantSlug,
  categories,
  brand,
  price,
  discount,
  inStock,
  isPreorder,
  stock,
  variant,
  isWishlisted,
  averageRating,
  totalRatings,
}: ProductInfoProps) {
  const gtmItem =
    variantSlug != null
      ? toGTMItem({
          slug: variantSlug,
          productTitle: productTitle ?? title,
          price: price ?? null,
          discountedPrice: discount?.price ?? null,
          brand: brand?.title ?? null,
          variantLabel: variant ?? null,
          categories,
        })
      : undefined

  return (
    <div className="flex flex-col justify-start gap-6">
      {gtmItem && (
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
      )}
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
          <WishlistButton
            currentUserId={currentUserId}
            variantId={id}
            isWishlisted={isWishlisted}
            gtmItem={gtmItem}
          />
        </div>
        <h1 className="text-xl font-bold text-pretty text-foreground md:text-3xl md:leading-9 md:text-balance">
          {title}
        </h1>
        {/* Brand */}
        {brand && (
          <Link
            href={`/brands/${brand?.slug}`}
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
                {isPreorder && (
                  <span className="font-normal text-muted-foreground">
                    &nbsp;(preorder)
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
        <Badge variant="secondary">{variant}</Badge>
      </div>

      {/* Add to Cart Button */}
      <ProductDetailCartActions
        variant={{
          id,
          stock,
          sku,
          slug: variantSlug ?? "",
          title,
          variant,
          price: price ?? null,
        }}
        inStock={inStock}
      />

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
            <Button variant="outline" size="icon-lg" className="rounded-full">
              <Facebook />
              <span className="sr-only">Share on Facebook</span>
            </Button>
          </li>
          <li>
            <Button variant="outline" size="icon-lg" className="rounded-full">
              <Twitter />
              <span className="sr-only">Share on Twitter</span>
            </Button>
          </li>
          <li>
            <Button variant="outline" size="icon-lg" className="rounded-full">
              <Whatsapp />
              <span className="sr-only">Share on Whatsapp</span>
            </Button>
          </li>
        </ul>
      </section>
    </div>
  )
}
