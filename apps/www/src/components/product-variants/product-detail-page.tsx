"use client"

import { ProductReviews } from "@/components/product-reviews/product-reviews"
import { ProductImageGallery } from "@/components/product-variants/product-image-gallery"
import { ProductInfo } from "@/components/product-variants/product-info"
import { ProductDetail } from "@/lib/utils/product-variants/get-product-variant-by-slug"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@eurofit/ui/components/breadcrumb"
import { Separator } from "@eurofit/ui/components/separator"

interface ProductDetailPageProps {
  currentUserId: string | undefined
  product: ProductDetail
}

export function ProductDetailPage({
  product,
  currentUserId,
}: ProductDetailPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <ProductInfo
            currentUserId={currentUserId}
            id={product.id}
            sku={product.sku}
            title={product.detailTitle ?? product.title}
            brand={product.product?.brand || null}
            price={product.retailPrice}
            discount={product.discount}
            inStock={!product.isOutOfStock}
            isPreorder={product.isPreorder}
            stock={product.stock}
            variant={product.variant}
            isWishlisted={product.isWishlisted}
            averageRating={product.averageRating}
            totalRatings={product.totalRatings}
          />
        </div>

        <Separator className="my-10 md:my-14" />

        {/* PRODUCT DESCRIPTION  */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold md:text-2xl">
            Product Description
          </h2>
          <div className="max-w-prose space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Accusantium aliquam eaque, labore fugiat ea voluptatibus assumenda
              repellat necessitatibus dignissimos sit voluptates exercitationem
              sequi adipisci porro, quisquam facere quaerat repudiandae
              blanditiis.
            </p>
            <p>
              Blanditiis rerum vitae, quis placeat adipisci dolorum id
              cupiditate laborum recusandae nam at. Odio neque tempore
              repellendus, voluptas minima corrupti laboriosam aliquid veniam at
              culpa cupiditate omnis, asperiores iste voluptatum.
            </p>
            <p>
              Officiis totam quis incidunt nemo tempora? Eius facilis sed qui
              impedit quibusdam harum distinctio, reprehenderit ullam dicta
              minus saepe ex in nemo, incidunt, delectus iusto officia sint?
              Distinctio, iusto aliquid.
            </p>
            <p>
              Omnis voluptate minus autem repudiandae, suscipit, veritatis
              architecto, maxime iste nam doloremque sed. Odit architecto
              delectus veritatis. Non qui at expedita exercitationem molestias
              doloribus, aliquam vero pariatur consequatur. Similique, amet?
            </p>
            <p>
              Dolores nisi nemo at corporis a odit quis sequi harum autem odio
              perferendis perspiciatis, quisquam tempore, quae deleniti. Minus
              cupiditate architecto minima laudantium vitae quis. Quam impedit
              ab ipsa sequi.
            </p>
          </div>
        </section>

        {/* PRODUCT REVIEWS  */}
        <ProductReviews
          productVariantId={product.id}
          variant={{
            title: product.detailTitle ?? product.title,
            variant: product.variant,
            sku: product.sku,
          }}
          currentUserId={currentUserId}
        />
      </div>
    </main>
  )
}
