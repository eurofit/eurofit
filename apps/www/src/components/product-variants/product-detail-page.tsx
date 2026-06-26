"use client"

import { ProductReviews } from "@/components/product-reviews/product-reviews"
import { ProductImageGallery } from "@/components/product-variants/product-image-gallery"
import {
  ProductInfo,
  type ProductInfoVariant,
} from "@/components/product-variants/product-info"
import { ProductDetail } from "@/lib/utils/product-variants/get-product-variant-by-slug"
import { Backlight } from "@eurofit/ui/components/backlight"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@eurofit/ui/components/breadcrumb"
import { Separator } from "@eurofit/ui/components/separator"
import { YouTubeEmbed } from "@next/third-parties/google"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { converters } from "../rich-text/converters"

interface ProductDetailPageProps {
  product: ProductDetail
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const productCategories = (product.product?.categories ?? []).flatMap(
    (cat) =>
      typeof cat === "object" && cat && "title" in cat
        ? [cat.title as string]
        : []
  )
  const variantCategory = product.category ?? null
  const categories = [
    ...new Set(
      variantCategory
        ? [...productCategories, variantCategory]
        : productCategories
    ),
  ]

  const labels = (product.labels?.docs ?? [])
    .filter(
      (l): l is NonNullable<typeof l> & object =>
        typeof l === "object" &&
        l !== null &&
        "isActive" in l &&
        Boolean(l.isActive)
    )
    .map((l) => {
      const label = l as {
        title: string
        icon?: string | null
        fg?: string | null
        bg?: string | null
      }
      return {
        title: label.title,
        icon: label.icon ?? null,
        fg: label.fg ?? null,
        bg: label.bg ?? null,
      }
    })

  const productInfoVariant: ProductInfoVariant = {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    title: product.detailTitle ?? product.title,
    productTitle: product.product?.title ?? product.title,
    categories,
    brand: product.product?.brand || null,
    price: product.retailPrice ?? null,
    discount: product.discount,
    inStock: !product.isOutOfStock,
    isBackorder: product.isBackorder,
    stock: product.stock,
    variant: product.variant ?? null,
    averageRating: product.averageRating,
    totalRatings: product.totalRatings,
    labels,
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 md:space-y-14 lg:px-8">
        <div className="py-4 md:py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Product Variations</BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>{product.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-8 pt-2 md:grid-cols-2 md:gap-12">
          {/* Left Column - Images */}
          <ProductImageGallery
            images={product.images}
            productTitle={product.title}
          />

          {/* Right Column - Info */}
          <ProductInfo variant={productInfoVariant} />
        </div>

        <Separator />

        {/* PRODUCT DESCRIPTION  */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold md:text-2xl">
            Product Description
          </h2>
          {!product.description && <p>N/A</p>}
          {product.description && (
            <RichText
              converters={converters}
              data={product.description}
              className="max-w-180"
            />
          )}
        </section>

        {/* Youtube video  */}
        {product.youtubeId && (
          <Backlight blur={40} className="w-full">
            <YouTubeEmbed
              videoid={product.youtubeId}
              height={400}
              params="controls=0"
              style="border-radius:6px"
            />
          </Backlight>
        )}

        {/* PRODUCT REVIEWS  */}
        <ProductReviews
          productVariantId={product.id}
          variant={{
            title: product.detailTitle ?? product.title,
            variant: product.variant,
            sku: product.sku,
          }}
        />
      </div>
    </main>
  )
}
