import { getCurrentUser } from "@/actions/auth/get-current-user"
import { getBrand } from "@/actions/brands/get-brand"
import { getProductsByBrand } from "@/actions/products/get-products-by-brand"
import { EndMessage } from "@/components/end-message"
import { JsonLd } from "@/components/json-ld"
import { Pagination } from "@/components/pagination"
import { EmptyProducts } from "@/components/products/empty-products"
import { ProductCard } from "@/components/products/product-card"
import { ProductsToolbar } from "@/components/products/products-toolbar"
import { BRAND_PRODUCTS_PER_PAGE } from "@/const/brand-filters"
import { site } from "@/const/site"
import { BrandSearchParams } from "@/lib/utils/brands/brand-search-params"
import { getBrandJsonLd } from "@/lib/utils/brands/get-brand-jsonld"
import { ServiceAreaDetail } from "@/types/service-area"
import pluralize from "pluralize-esm"
import * as React from "react"

type BrandProductsProps = {
  slug: Promise<string>
  searchParams: Promise<BrandSearchParams>
  mobileFiltersSlot?: React.ReactNode
  area?: Promise<ServiceAreaDetail | null>
}

export async function BrandProducts({
  slug: slugPromise,
  searchParams: searchParamsPromise,
  mobileFiltersSlot,
  area: areaPromise,
}: BrandProductsProps) {
  const [slug, searchParams, user, area] = await Promise.all([
    slugPromise,
    searchParamsPromise,
    getCurrentUser(),
    areaPromise ?? null,
  ])

  const { page, sortDirection, category, size, flavourColour } = searchParams

  const [
    brand,
    { products, totalProducts, totalPages, hasNextPage, pagingCounter },
  ] = await Promise.all([
    getBrand({ slug }),
    getProductsByBrand({
      brand: slug,
      page,
      limit: BRAND_PRODUCTS_PER_PAGE,
      sortDirection,
      category,
      size,
      flavourColour,
    }),
  ])

  const brandJsonLd = brand
    ? getBrandJsonLd({
        brand,
        products,
        totalProducts,
        page,
        pagingCounter,
        area,
      })
    : null

  if (totalProducts === 0) {
    return (
      <>
        {brandJsonLd && <JsonLd jsonLd={brandJsonLd} />}
        <EmptyProducts />
      </>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      {brandJsonLd && <JsonLd jsonLd={brandJsonLd} />}

      <ProductsToolbar
        sortDirection={sortDirection}
        mobileFiltersSlot={mobileFiltersSlot}
      />

      <div className="space-y-10">
        <p className="mb-2 flex-1 text-sm text-muted-foreground">
          <span className="text-destructive">{totalProducts}</span>{" "}
          {pluralize("Product", totalProducts)} found
        </p>

        <section id="brand-products-list" className="grid gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} userId={user?.id} />
          ))}
        </section>

        <Pagination count={totalPages} page={page} />

        {!hasNextPage && (
          <EndMessage
            title={
              <>
                You&apos;ve seen all {totalProducts}{" "}
                {pluralize("product", totalProducts)}.
              </>
            }
            description={
              <>
                Can&apos;t find what you need?{" "}
                <a
                  href={`https://wa.me/${site.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Message us on WhatsApp.
                </a>
              </>
            }
          />
        )}
      </div>
    </div>
  )
}
