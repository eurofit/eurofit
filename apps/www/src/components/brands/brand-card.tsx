import { ImageWithRetry } from "@/components/image-with-retry"
import { Brand } from "@/types/brand"
import { AspectRatio } from "@eurofit/ui/components/aspect-ratio"
import { Card, CardFooter } from "@eurofit/ui/components/card"
import { Skeleton } from "@eurofit/ui/components/skeleton"
import { cn } from "@eurofit/ui/lib/utils"
import { ChevronRight, ImageOff } from "lucide-react"
import Link from "next/link"

type BrandCardProps = Brand & {
  index: number
}

export function BrandCard({ title, image, slug, index }: BrandCardProps) {
  return (
    <Link
      title={`Shop ${title} products`}
      aria-label={`View products from ${title}`}
      href={`/brands/${slug}`}
      className="group block h-full rounded-xl focus-visible:outline-none"
    >
      <Card
        aria-labelledby={slug}
        className="h-full gap-0 py-0 transition-[box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-ring group-focus-visible:ring-2 group-focus-visible:ring-ring"
      >
        <AspectRatio ratio={4 / 3} className="bg-card">
          {image ? (
            <ImageWithRetry
              src={image}
              alt={`${title} logo`}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              loading={index > 4 ? "lazy" : "eager"}
              priority={index <= 4}
              fetchPriority={index <= 4 ? "high" : "auto"}
            />
          ) : (
            <div
              role="img"
              aria-label={`${title} logo not available`}
              className="relative flex size-full items-center justify-center bg-muted"
            >
              <ImageOff className="size-2/5 text-muted-foreground/70" />
            </div>
          )}
        </AspectRatio>
        <CardFooter className="justify-between gap-2">
          <h2
            id={slug}
            className="font-heading line-clamp-1 text-sm font-medium text-foreground"
          >
            {title}
          </h2>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5" />
        </CardFooter>
      </Card>
    </Link>
  )
}

export function BrandSkeleton() {
  return (
    <Card className="h-full gap-0 py-0">
      <AspectRatio ratio={4 / 3}>
        <Skeleton className="size-full rounded-none" />
      </AspectRatio>
      <CardFooter>
        <Skeleton className="h-4 w-2/3" />
      </CardFooter>
    </Card>
  )
}

type BrandsSkeletonProps = React.ComponentPropsWithRef<"div"> & {
  length?: number
}

export function BrandsSkeleton({
  length = 12,
  className,
  ...props
}: BrandsSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6",
        className
      )}
      {...props}
    >
      {Array.from({ length }).map((_, i) => (
        <BrandSkeleton key={`brand-skeleton-${i}`} />
      ))}
    </div>
  )
}
