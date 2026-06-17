import { site } from "@/const/site"
import {
  BRAND_AREAS_PAGE_SIZE,
  getBrandAreas,
  getBrandAreasTotal,
} from "@/lib/utils/brands/get-brand-areas"
import { Metadata } from "next"
import { Suspense } from "react"

type Props = { searchParams: Promise<{ page?: string }> }

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1
  const canonicalUrl =
    page === 1
      ? `${site.url}/sitemaps/brand-areas`
      : `${site.url}/sitemaps/brand-areas?page=${page}`

  return {
    title: "Brand Areas Sitemap",
    alternates: { canonical: canonicalUrl },
  }
}

export default function BrandAreasSitemapPage({ searchParams }: Props) {
  return (
    <Suspense>
      <BrandAreasContent searchParams={searchParams} />
    </Suspense>
  )
}

async function BrandAreasContent({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1

  const [brandAreas, total] = await Promise.all([
    getBrandAreas({ page }),
    getBrandAreasTotal(),
  ])

  const totalPages = Math.ceil(total / BRAND_AREAS_PAGE_SIZE)
  const hasPreviousPage = page > 1
  const hasNextPage = page < totalPages

  return (
    <>
      <nav aria-label="Brand areas directory">
        <ul>
          {brandAreas.map((item) => (
            <li key={`${item.brand.slug}-${item.area.slug}`}>
              <a href={`/brands/${item.brand.slug}/${item.area.slug}`}>
                {item.brand.title} – {item.area.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        {hasPreviousPage && (
          <a href={`?page=${page - 1}`} rel="prev">
            Previous
          </a>
        )}
        {` Page ${page} of ${totalPages} `}
        {hasNextPage && (
          <a href={`?page=${page + 1}`} rel="next">
            Next
          </a>
        )}
      </div>
    </>
  )
}
