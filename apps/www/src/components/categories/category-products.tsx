import { getCurrentUser } from "@/actions/auth/get-current-user"
import { getCategory } from "@/actions/categories/get-category"
import { getProductsByCategory } from "@/actions/products/get-products-by-category"
import { EndMessage } from "@/components/end-message"
import { JsonLd } from "@/components/json-ld"
import { Pagination } from "@/components/pagination"
import { EmptyProducts } from "@/components/products/empty-products"
import { ProductCard } from "@/components/products/product-card"
import { ProductsToolbar } from "@/components/products/products-toolbar"
import { CATEGORY_PRODUCTS_PER_PAGE } from "@/const/category-filters"
import { site } from "@/const/site"
import { CategorySearchParams } from "@/lib/utils/categories/category-search-params"
import { getCategoryJsonLd } from "@/lib/utils/categories/get-category-jsonld"
import pluralize from "pluralize-esm"
import * as React from "react"

type CategoryProductsProps = {
  slug: Promise<string>
  searchParams: Promise<CategorySearchParams>
  mobileFiltersSlot?: React.ReactNode
}

export async function CategoryProducts({
  slug: slugPromise,
  searchParams: searchParamsPromise,
  mobileFiltersSlot,
}: CategoryProductsProps) {
  const [slug, searchParams, user] = await Promise.all([
    slugPromise,
    searchParamsPromise,
    getCurrentUser(),
  ])

  const { page, sortDirection, brand, size, flavourColour } = searchParams

  const [
    category,
    { products, totalProducts, totalPages, hasNextPage, pagingCounter },
  ] = await Promise.all([
    getCategory({ slug }),
    getProductsByCategory({
      slug,
      page,
      limit: CATEGORY_PRODUCTS_PER_PAGE,
      sortDirection,
      brand,
      size,
      flavourColour,
    }),
  ])

  const categoryJsonLd = category
    ? getCategoryJsonLd({
        category,
        products,
        totalProducts,
        page,
        pagingCounter,
      })
    : null

  if (totalProducts === 0) {
    return (
      <>
        {categoryJsonLd && <JsonLd jsonLd={categoryJsonLd} />}
        <EmptyProducts />
      </>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      {categoryJsonLd && <JsonLd jsonLd={categoryJsonLd} />}

      <ProductsToolbar
        sortDirection={sortDirection}
        mobileFiltersSlot={mobileFiltersSlot}
      />

      <div className="space-y-10">
        <p className="mb-2 flex-1 text-sm text-muted-foreground">
          <span className="text-destructive">{totalProducts}</span>{" "}
          {pluralize("Product", totalProducts)} found
        </p>

        <section id="category-products-list" className="grid gap-8 md:gap-10">
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
