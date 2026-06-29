import { PayloadIcon } from "@/components/payload-icon"
import { savingsLabel } from "@/components/product-variants/variant-price"
import { normalizeVariantDiscount } from "@/lib/utils/discounts/normalize-variant-discount"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import {
  type Media,
  type ProductListBlock,
  type ProductVariant,
} from "@/payload-types"
import { AspectRatio } from "@eurofit/ui/components/aspect-ratio"
import { Badge } from "@eurofit/ui/components/badge"
import { ChevronRight, ImageOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ProductListTimer } from "./product-list-timer"

export function ProductList({
  icon,
  iconFillColor,
  title,
  products,
  styles,
  timer,
  link,
}: ProductListBlock) {
  const formattedVariants =
    products
      ?.map((p) => p.product)
      .filter(
        (variant): variant is ProductVariant =>
          typeof variant === "object" && variant !== null
      ) ?? []

  return (
    <section
      className="py-2 max-md:-mx-4 max-md:px-4 md:px-4"
      style={{
        backgroundColor: styles?.contentBg ?? undefined,
        color: styles?.contentFg ?? undefined,
      }}
    >
      <div
        className="p-2 pr-4 pl-0"
        style={{
          backgroundColor: styles?.headerBg ?? undefined,
          color: styles?.headerFg ?? undefined,
        }}
      >
        <div className="flex items-center justify-between gap-2 md:grid md:grid-cols-3 md:items-center">
          <h2 className="flex scroll-m-20 items-center gap-2 text-lg font-bold">
            <PayloadIcon name={icon} size={20} fill={iconFillColor} />
            {title}
          </h2>
          <div className="hidden text-center md:block">
            {timer && <ProductListTimer timer={timer} />}
          </div>
          <div className="flex items-center justify-end">
            {link?.href && (
              <Link href={link.href} className="flex items-center gap-1">
                <span>{link.label ?? "View more"}</span>
                <ChevronRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
        {timer && (
          <div className="mt-1 md:hidden">
            <ProductListTimer timer={timer} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 py-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        {formattedVariants.map((variant) => (
          <ProductCard key={variant.id} variant={variant} />
        ))}
      </div>
    </section>
  )
}

/**
 * Resolves the card image with the fallback chain: variant images first, then the
 * parent product's images, then the parent product's supplier image URL.
 */
function resolveCardImage(variant: ProductVariant): string | null {
  const firstUploadedUrl = (
    images: (string | Media)[] | null | undefined
  ): string | null => {
    const url = images?.find(
      (image): image is Media =>
        typeof image === "object" && image !== null && !!image.url
    )?.url
    return url ?? null
  }

  const variantImage = firstUploadedUrl(variant.images)
  if (variantImage) return variantImage

  const product = typeof variant.product === "object" ? variant.product : null

  return firstUploadedUrl(product?.images) ?? product?.supplierImageUrl ?? null
}

type ProductCardProps = {
  variant: ProductVariant
}

function ProductCard({ variant }: ProductCardProps) {
  const { slug, title, retailPrice } = variant
  const image = resolveCardImage(variant)
  const discount = normalizeVariantDiscount(variant.discount)

  return (
    <Link
      href={`/product-variants/${slug}`}
      className="relative space-y-2 rounded-lg bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
    >
      <AspectRatio
        ratio={4 / 3}
        className="flex items-center justify-center rounded-t-lg bg-white"
      >
        {image ? (
          <Image
            alt={"Image of " + title}
            src={image}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        ) : (
          <ImageOff className="m-auto size-12 text-muted-foreground" />
        )}
      </AspectRatio>
      <div className="space-y-2 px-2 pb-2">
        <h3 className="line-clamp-2 leading-tight font-medium">{title}</h3>
        {retailPrice != null &&
          (discount ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-lg font-bold text-destructive tabular-nums">
                Ksh {formatWithCommas(discount.price)}
              </span>
              <span className="text-sm text-muted-foreground tabular-nums line-through">
                Ksh {formatWithCommas(retailPrice)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-foreground tabular-nums">
              Ksh {formatWithCommas(retailPrice)}
            </span>
          ))}
      </div>
      {discount && (
        <Badge
          variant="destructive"
          className="absolute top-2 right-2 text-xs font-bold"
        >
          {savingsLabel(discount)}
        </Badge>
      )}
    </Link>
  )
}
