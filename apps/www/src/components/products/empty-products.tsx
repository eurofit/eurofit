import { Button } from "@eurofit/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@eurofit/ui/components/empty"
import { Package } from "lucide-react"
import Link from "next/link"

type EmptyProductsProps = React.ComponentProps<typeof Empty> & {
  href?: string
}

export function EmptyProducts({
  href = "/brands",
  ...props
}: EmptyProductsProps) {
  return (
    <Empty className="m-auto max-w-md" {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package />
        </EmptyMedia>
        <EmptyTitle>No Products Found </EmptyTitle>
        <EmptyDescription>
          Oops! There are no products available for this brand at the moment.
          Please check back later or explore other brands in our store.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" asChild>
          <Link href={href}>Explore Other Brands</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
