import { ImageWithRetry } from "@/components/image-with-retry"
import { ProductVariantCard } from "@/components/product-variants/product-variant-card"
import { Product } from "@/types/products"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@eurofit/ui/components/card"
import { Separator } from "@eurofit/ui/components/separator"
import { Skeleton } from "@eurofit/ui/components/skeleton"
import { ImageOff } from "lucide-react"
import Link from "next/link"
import pluralize from "pluralize-esm"
import React from "react"

type ProductCardProps = React.ComponentProps<typeof Card> & {
  product: Product
  userId?: string | null
  href?: string
}

//TODO: fix mobile view

export function ProductCard({
  product: { slug, title, origin, image, productVariants },
  userId,
}: ProductCardProps) {
  return (
    <Card
      id={slug}
      className="w-full border border-gray-200 bg-white py-0 pb-6 shadow-none"
    >
      <CardHeader className="border-b border-gray-200 bg-muted pt-6 pb-4">
        <div className="space-y-2">
          <CardTitle className="text-xl tracking-tight text-balance">
            <Link
              href={`/products/${slug}`}
              className="hover:underline hover:underline-offset-4"
            >
              {title}
            </Link>
          </CardTitle>
          <CardDescription>Country of Origin: {origin}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative grid grid-cols-1 content-start items-start gap-8 lg:grid-cols-5">
          <div className="flex flex-col items-center justify-center gap-6 md:sticky md:top-12 lg:col-span-2">
            <div className="sticky top-5 flex aspect-square w-full max-w-87.5 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white">
              {image ? (
                <ImageWithRetry
                  src={image}
                  alt={title}
                  fill
                  className="m-auto max-h-11/12 max-w-11/12 object-contain"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              ) : (
                <ImageOff
                  className="m-auto size-1/2 text-muted"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          <div className="z-2 space-y-4 bg-background lg:col-span-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-balance text-gray-900">
                Choose Variants
              </h3>
              <span className="font-variant-numeric-tabular-nums border-gray-300 text-xs text-gray-600">
                {productVariants.length}
                &nbsp;
                {pluralize("Option", productVariants.length)}
              </span>
            </div>

            <div className="space-y-3">
              {productVariants.map((variant, index) => (
                <React.Fragment key={variant.id}>
                  <ProductVariantCard variant={variant} userId={userId} />
                  {index < productVariants.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex grow flex-col gap-4">
      <div className="grid gap-2 py-4 pb-4 md:pt-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="relative flex w-full flex-col gap-4 md:flex-row">
        <Skeleton className="aspect-square w-full md:max-w-80" />
        <div className="relative w-full">
          <div className="flex items-center justify-between">
            <Skeleton className="mb-4 h-4 w-2/5" />
            <Skeleton className="mb-4 h-4 w-1/6" />
          </div>
          <div className="grid gap-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-5/6" />
            <Skeleton className="h-14 w-4/6" />
            <Skeleton className="h-14 w-3/6" />
          </div>
        </div>
      </div>
    </div>
  )
}
