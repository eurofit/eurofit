import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { Badge } from "@eurofit/ui/components/badge"
import { Flame, Star } from "lucide-react"
import Link from "next/link"
import { ProductDetailCartActions } from "./product-detail-cart-actions"
import { WishlistButton } from "./wishlist-button"

interface ProductInfoProps {
  currentUserId: string | undefined
  id: string
  title: string
  brand: {
    title: string
    slug: string
  } | null
  price?: number | null
  inStock: boolean
  stock: number
  variant?: string | null
  isWishlisted: boolean
}

export function ProductInfo({
  currentUserId,
  id,
  title,
  brand,
  price,
  inStock,
  stock,
  variant,
  isWishlisted,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col justify-start gap-6">
      {/* Header with Wishlist */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-700 text-white uppercase">
                <Flame className="fill-white" />
                trending
              </Badge>
              <Badge className="bg-green-50 text-green-700 uppercase">
                best seller
              </Badge>
            </div>
            <WishlistButton
              currentUserId={currentUserId}
              variantId={id}
              isWishlisted={isWishlisted}
            />
          </div>
          <h1 className="text-lg font-bold text-pretty text-foreground md:text-2xl md:leading-8 md:text-balance">
            {title}
          </h1>
          {/* Brand */}
          {brand && (
            <Link
              href={`/brands/${brand?.slug}`}
              className="text-blue-900 hover:underline hover:underline-offset-4"
            >
              Visit the {brand.title} store
            </Link>
          )}
        </div>
      </div>

      {/* Rating and Stock */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(4.5)
                    ? "fill-orange-400 text-orange-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({32} verified ratings)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {inStock ? (
            <>
              <div className="size-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-700">
                {formatWithCommas(stock)} In stock
              </span>
            </>
          ) : (
            <>
              <div className="size-2 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-red-700">
                Out of stock
              </span>
            </>
          )}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-foreground tabular-nums">
              Ksh {price != null ? formatWithCommas(price) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Variation Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          VARIATION AVAILABLE
        </label>
        <Badge variant="secondary">{variant}</Badge>
      </div>
      {/* Add to Cart Button */}
      <ProductDetailCartActions variant={{ id, stock }} inStock={inStock} />

      {/* Promotions */}

      <p className="text-sm text-blue-900">Fast & Secure Payments</p>
    </div>
  )
}
