import { getCurrentUser } from "@/actions/auth/get-current-user"
import { searchProducts } from "@/actions/products/search-products"
import { EndMessage } from "@/components/end-message"
import { Pagination } from "@/components/pagination"
import { EmptyProducts } from "@/components/products/empty-products"
import { ProductCard } from "@/components/products/product-card"
import { ProductsToolbar } from "@/components/products/products-toolbar"
import { SEARCH_PRODUCTS_PER_PAGE } from "@/const/search-filters"
import { site } from "@/const/site"
import { ProductSearchParams } from "@/lib/utils/search/search-params"
import { notFound } from "next/navigation"
import pluralize from "pluralize-esm"
import * as React from "react"

type SearchProductsProps = {
  searchParams: Promise<ProductSearchParams>
  mobileFiltersSlot?: React.ReactNode
}

export async function SearchProducts({
  searchParams: searchParamsPromise,
  mobileFiltersSlot,
}: SearchProductsProps) {
  const [searchParams, user] = await Promise.all([
    searchParamsPromise,
    getCurrentUser(),
  ])

  const { q, page, sortDirection, brand, category, size, flavourColour } =
    searchParams

  if (!q) notFound()

  const { products, totalProducts, totalPages, hasNextPage } =
    await searchProducts(q, {
      page,
      limit: SEARCH_PRODUCTS_PER_PAGE,
      sortDirection,
      brand,
      category,
      size,
      flavourColour,
    })

  if (totalProducts === 0) {
    return <EmptyProducts />
  }

  return (
    <div className="flex flex-col space-y-6">
      <hgroup className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground tabular-nums">
            {totalProducts}
          </span>{" "}
          {pluralize("result", totalProducts)} for
        </p>
        <h1 className="scroll-m-20 text-2xl font-bold tracking-tight text-balance">
          &ldquo;{q}&rdquo;
        </h1>
      </hgroup>

      <ProductsToolbar
        sortDirection={sortDirection}
        mobileFiltersSlot={mobileFiltersSlot}
      />

      <div className="space-y-10">
        <section id="search-products-list" className="grid gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} userId={user?.id} />
          ))}
        </section>

        <Pagination count={totalPages} page={page} preserveParams />

        {!hasNextPage && (
          <EndMessage
            title={
              <>
                You&apos;ve seen all {totalProducts}{" "}
                {pluralize("result", totalProducts)}.
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
