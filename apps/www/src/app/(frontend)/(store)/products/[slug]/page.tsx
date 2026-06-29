import { getCurrentUser } from "@/actions/auth/get-current-user"
import { GTMEventTracker } from "@/components/analytics/gtm-event-tracker"
import { ImageWithRetry } from "@/components/image-with-retry"
import { JsonLd } from "@/components/json-ld"
import { ProductVariantsList } from "@/components/product-variants/product-variants-list"
import { getProductJsonLd } from "@/components/products/get-product-json-ld"
import { H1 } from "@/components/typography"
import {
  GTM_ECOMMERCE_CURRENCY,
  GTM_ECOMMERCE_EVENT,
} from "@/const/gtm-ecommerce-events"
import { ProductAnalyticsProvider } from "@/contexts/product-analytics-context"
import { toGTMItem } from "@/lib/analytics/ecommerce/to-gtm-item"
import { getProductBySlug } from "@/lib/utils/products/get-product-by-slug"
import { Badge } from "@eurofit/ui/components/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@eurofit/ui/components/breadcrumb"
import { ImageOff } from "lucide-react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import pluralize from "pluralize-esm"

type ProductPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params: paramsPromise,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await paramsPromise
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return {
    title: {
      absolute: product.title,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const [product, user] = await Promise.all([
    getProductBySlug(slug),
    getCurrentUser(),
  ])

  if (!product) notFound()

  const { image, title, productVariants } = product

  const jsonLd = getProductJsonLd(product)

  const productBrand =
    product.brand && typeof product.brand === "object"
      ? product.brand.title
      : null

  const productCategories = (product.categories ?? []).flatMap((cat) =>
    typeof cat === "object" && cat !== null && "title" in cat
      ? [cat.title as string]
      : []
  )

  const gtmItems = productVariants.map((variant, index) =>
    toGTMItem(
      {
        sku: variant.sku,
        productTitle: title,
        price: variant.price,
        discountedPrice: variant.discount?.price ?? null,
        brand: productBrand,
        variantLabel: variant.variant ?? variant.title,
        categories: productCategories,
      },
      index
    )
  )

  return (
    <>
      <JsonLd jsonLd={jsonLd} />
      {gtmItems.length > 0 && (
        <GTMEventTracker
          ecommerce
          userData={{ id: user?.id ?? undefined }}
          event={{
            event: GTM_ECOMMERCE_EVENT.VIEW_ITEM_LIST,
            ecommerce: {
              currency: GTM_ECOMMERCE_CURRENCY,
              item_list_id: product.slug,
              item_list_name: title,
              items: gtmItems,
            },
          }}
        />
      )}
      <div className="space-y-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Products</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex w-full flex-col items-start gap-16 md:flex-row">
          <div className="relative grow space-y-10">
            <H1>{title}</H1>
            <main className="flex w-full flex-col items-start gap-6 md:flex-row md:gap-10">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white max-md:w-full md:max-w-xl md:basis-3/5">
                {image && (
                  <ImageWithRetry
                    src={image}
                    alt={title + " image"}
                    fill
                    className="m-auto max-h-11/12 max-w-11/12 object-contain"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                )}
                {!image && (
                  <ImageOff
                    className="m-auto size-1/2 text-muted"
                    aria-label="Image not available"
                  />
                )}
              </div>
              <div className="z-2 w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Choose Variants</h3>
                  <Badge variant="outline">
                    {productVariants.length}{" "}
                    {pluralize("option", productVariants.length)}
                  </Badge>
                </div>
                <ProductAnalyticsProvider
                  brand={productBrand}
                  categories={productCategories}
                >
                  <ProductVariantsList
                    productVariants={productVariants}
                    userId={user?.id}
                  />
                </ProductAnalyticsProvider>
              </div>
            </main>
          </div>

          {/* <aside className="basis-1/4 space-y-10 md:px-4">
          {relatedProducts.products && relatedProducts?.products.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Similar Products</h3>
                {relatedProducts.total > 5 && (
                  <Button variant="link" size="sm" asChild>
                    <Link href={'/products' + '?' + categoryParams}>
                      See all
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
              <ul className="space-y-2.5">
                {relatedProducts.products.map((rp) => (
                  <li key={rp.slug}>
                    <Link
                      href={'/products/' + rp.slug}
                      className="hover:bg-accent/50 flex items-center gap-3 rounded-md p-1"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-white">
                        {rp.image ? (
                          <ImageWithRetry
                            src={rp.image}
                            alt={`${rp.title} image`}
                            fill
                            className="object-contain p-1"
                            sizes="48px"
                          />
                        ) : (
                          <ImageOff
                            className="text-muted-foreground m-auto size-1/2"
                            aria-label="Image not available"
                          />
                        )}
                      </div>

                      <h4 className="line-clamp-2 text-sm leading-tight">{rp.title}</h4>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside> */}
        </div>
      </div>
    </>
  )
}
