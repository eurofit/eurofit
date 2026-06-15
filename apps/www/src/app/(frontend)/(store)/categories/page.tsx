import { Categories } from "@/components/categories/categories"
import { CategoriesSkeleton } from "@/components/categories/category-card"
import { site } from "@/const/site"
import { Metadata } from "next"
import * as React from "react"

export const metadata: Metadata = {
  title: "Shop Supplements & Sports Nutrition by Category in Kenya",
  description:
    "Shop sports nutrition and supplements by category — protein, creatine, collagen, electrolytes and more. Authentic brands at retail & wholesale prices, delivered across Kenya.",
  alternates: {
    canonical: site.url + "/categories",
  },
}

type CategoriesPageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

export default function CategoriesPage({ searchParams }: CategoriesPageProps) {
  return (
    <main className="space-y-8 md:space-y-14">
      <hgroup className="mx-auto mb-8 max-w-xl space-y-2 text-center text-pretty">
        <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
          Every Goal. One Place.
        </span>
        <h1
          id="category-list-heading"
          className="text-3xl font-bold tracking-tight text-balance"
        >
          Shop Supplements by Category in Kenya
        </h1>
        <p className="text-balance text-muted-foreground">
          From protein and creatine to vitamins and collagen — find exactly what
          your goal needs. Authentic brands at retail &amp; wholesale prices,
          delivered across Kenya.
        </p>
      </hgroup>

      <React.Suspense fallback={<CategoriesSkeleton />}>
        <Categories searchParams={searchParams} />
      </React.Suspense>
    </main>
  )
}
