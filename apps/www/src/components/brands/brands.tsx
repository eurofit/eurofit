import { getBrands } from "@/actions/brands/get-brands"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@eurofit/ui/components/empty"
import { BrandList } from "./brands-list"

type BrandsProps = {
  page: number
}

const BRANDS_LIMIT = 35

export async function Brands({ page }: BrandsProps) {
  const result = await getBrands({ page, limit: BRANDS_LIMIT })

  if (!result.success || !result.data.totalBrands) {
    return <EmptyBrands />
  }

  return (
    <BrandList
      initialData={result.data}
      totalBrands={result.data.totalBrands}
    />
  )
}

function EmptyBrands() {
  return (
    <Empty className="m-auto flex h-fit w-fit border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No Brands Found</EmptyTitle>
        <EmptyDescription>
          Our brand catalogue isn&apos;t loading right now. Refresh the page or{" "}
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
