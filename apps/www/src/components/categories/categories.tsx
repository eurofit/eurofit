import { getCategories } from "@/actions/categories/get-categories"
import { JsonLd } from "@/components/json-ld"
import { getCategoriesJsonLd } from "@/lib/utils/categories/get-categories-json-ld"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@eurofit/ui/components/empty"
import { CategoryList } from "./categories-list"

type CategoriesProps = {
  searchParams: Promise<{ page?: string }>
}

const CATEGORIES_LIMIT = 24

export async function Categories({ searchParams }: CategoriesProps) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1

  const result = await getCategories({ page, limit: CATEGORIES_LIMIT })

  if (!result.success || !result.data.totalCategories) {
    return <EmptyCategories />
  }

  const jsonLds = getCategoriesJsonLd(result.data)

  return (
    <>
      <JsonLd jsonLd={jsonLds} />
      <CategoryList
        initialData={result.data}
        totalCategories={result.data.totalCategories}
      />
    </>
  )
}

function EmptyCategories() {
  return (
    <Empty className="m-auto flex h-fit w-fit border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No Categories Found</EmptyTitle>
        <EmptyDescription>
          Our category catalogue isn&apos;t loading right now. Refresh the page
          or{" "}
          <a
            href="https://wa.me/254110990666"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            contact us on WhatsApp
          </a>{" "}
          if this continues.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
