import { ImageWithRetry } from "@/components/image-with-retry"
import { Brand } from "@/types/brand"
import { AspectRatio } from "@eurofit/ui/components/aspect-ratio"
import { Skeleton } from "@eurofit/ui/components/skeleton"
import { cn } from "@eurofit/ui/lib/utils"
import { ImageOff } from "lucide-react"
import Link from "next/link"

type BrandCardProps = Brand & {
  index: number
}

export function BrandCard({ title, image, slug, index }: BrandCardProps) {
  return (
    <article
      aria-labelledby={slug}
      className="group transition-color relative overflow-hidden rounded-lg duration-300 hover:outline hover:outline-red-500"
    >
      <AspectRatio ratio={4 / 3}>
        {image && (
          <ImageWithRetry
            src={image}
            alt={`${title} logo`}
            fill
            className="m-auto max-h-11/12 object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 20vw"
            loading={index > 4 ? "lazy" : "eager"}
            priority={index <= 4}
            fetchPriority={index <= 4 ? "high" : "auto"}
          />
        )}
        {!image && (
          <div
            role="img"
            aria-label={`${title} logo not available`}
            className="relative flex size-full items-center justify-center bg-muted"
          >
            <ImageOff className="size-2/5 text-muted-foreground/70" />
          </div>
        )}
      </AspectRatio>
      <div className="flex-1 rounded-b-lg bg-linear-to-r from-primary to-primary/90 py-4 text-primary-foreground">
        <h2 id={slug} className="font-heading text-center font-bold uppercase">
          {title}
        </h2>
      </div>
      <Link
        title={`Shop ${title} products`}
        aria-label={`View products from ${title}`}
        href={`/brands/${slug}`}
        className="absolute inset-0"
      />
    </article>
  )
}

export function BrandSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-square max-w-xs" />
    </div>
  )
}

type BrandsSkeletonProps = React.ComponentPropsWithRef<"div"> & {
  length?: number
}

export function BrandsSkeleton({
  length = 10,
  className,
  ...props
}: BrandsSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10 lg:grid-cols-4 xl:grid-cols-5",
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
