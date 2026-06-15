"use client"

import { Facebook } from "@/components/icons/facebook"
import { Twitter } from "@/components/icons/twitter"
import { Whatsapp } from "@/components/icons/whatsapp"
import { ProductImageGallery } from "@/components/product-variants/product-image-gallery"
import { ProductInfo } from "@/components/product-variants/product-info"
import { ProductReviews } from "@/components/product-variants/product-reviews"
import { getPayloadImageUrl } from "@/lib/utils/payload-image"
import { ProductDetail } from "@/lib/utils/product-variants/get-product-variant-by-slug"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@eurofit/ui/components/breadcrumb"
import { Button } from "@eurofit/ui/components/button"
import { Separator } from "@eurofit/ui/components/separator"

interface ProductDetailPageProps {
  currentUserId: string | undefined
  product: ProductDetail
}

export function ProductDetailPage({
  product,
  currentUserId,
}: ProductDetailPageProps) {
  const parentProductImages = (product.product?.images ?? [])
    .map(getPayloadImageUrl)
    .concat([product.product?.supplierImageUrl ?? null])
    .filter((i) => typeof i == "string")

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {/* Left Column - Images */}
          <div className="flex flex-col">
            <ProductImageGallery
              images={product.images}
              defaultImages={parentProductImages}
              productTitle={product.title}
            />
            <Separator className="my-6" />
            <section className="space-y-2">
              <h2 className="text-sm font-medium uppercase">
                Share this product
              </h2>
              <ul className="flex items-center gap-2">
                <li>
                  <Button
                    variant="outline"
                    size="icon-lg"
                    className="rounded-full"
                  >
                    <Facebook />
                    <span className="sr-only">Share on Facebook</span>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline"
                    size="icon-lg"
                    className="rounded-full"
                  >
                    <Twitter />
                    <span className="sr-only">Share on Twitter</span>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline"
                    size="icon-lg"
                    className="rounded-full"
                  >
                    <Whatsapp />
                    <span className="sr-only">Share on Whatsapp</span>
                  </Button>
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column - Info */}
          <div className="flex flex-col">
            <ProductInfo
              currentUserId={currentUserId}
              id={product.id}
              title={product.detailTitle ?? product.title}
              brand={product.product?.brand || null}
              price={product.retailPrice}
              inStock={!product.isOutOfStock}
              stock={product.stock}
              variant={product.variant}
              isWishlisted={product.isWishlisted}
            />
          </div>
        </div>

        <Separator className="my-8 md:my-12" />
        {/* PRODUCT DESCRIPTION  */}
        <section className="space-y-4 py-4">
          <div className="">
            <h2 className="text-base leading-snug font-medium capitalize">
              Product Description
            </h2>
          </div>
          <div className="space-y-4">
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
        <ProductReviews />
      </div>
    </main>
  )
}
