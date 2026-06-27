import { PayloadIcon } from "@/components/payload-icon"
import { Countdown } from "@/components/timer/countdown"
import { type Product, type ProductListBlock } from "@/payload-types"
import { AspectRatio } from "@eurofit/ui/components/aspect-ratio"
import { Badge } from "@eurofit/ui/components/badge"
import { isFuture } from "date-fns"
import { ChevronRight, ImageOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function ProductList({
  icon,
  title,
  products,
  styles,
  timer,
  link,
}: ProductListBlock) {
  const formattedProducts =
    products
      ?.map((p) => p.product)
      .filter((product) => !!product && typeof product === "object") ?? []

  return (
    <section
      className="py-2 max-md:-mx-4 max-md:px-4 md:px-4"
      style={{
        backgroundColor: styles?.contentBg ?? undefined,
        color: styles?.contentFg ?? undefined,
      }}
    >
      <div
        className="border-t-md flex items-center justify-between p-2"
        style={{
          backgroundColor: styles?.headerBg ?? undefined,
          color: styles?.headerFg ?? undefined,
        }}
      >
        <h2 className="flex scroll-m-20 items-center gap-2 text-lg font-bold">
          <PayloadIcon name={icon} size={20} />
          {title}
        </h2>
        {timer && isFuture(timer) && (
          <div className="mx-auto tracking-tight">
            <span className="capitalize">Time left</span>
            &nbsp;
            <Countdown endDate={timer} />
          </div>
        )}
        {link && (
          <Link href={link.href} className="ml-auto flex items-center gap-2">
            <span>{link.label}</span>
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      <div className="grid gap-6 py-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {formattedProducts.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </div>
    </section>
  )
}

type ProductProps = {
  product: Product
}

function Product({ product }: ProductProps) {
  const { slug, title, image } = product
  return (
    <Link
      href={`/products/${slug}`}
      className="relative space-y-2 rounded-lg bg-card text-card-foreground shadow-sm"
    >
      <AspectRatio
        ratio={4 / 3}
        className="flex items-center justify-center rounded-t-lg bg-white"
      >
        {image ? (
          <Image
            alt={"Image of " + title}
            src={image}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        ) : (
          <ImageOff className="m-auto size-12 text-muted-foreground" />
        )}
      </AspectRatio>
      <div className="space-y-2 px-2">
        <h3 className="leading-tight font-medium">{title}</h3>
        <div className="flex items-center space-x-2">
          <ins className="font-bold no-underline">Ksh 11,650</ins>
          <del className="before relative text-sm no-underline before:absolute before:top-1/2 before:right-0 before:left-0 before:-translate-y-1/2 before:rotate-5 before:border-t before:border-t-red-700 before:content-['']">
            Ksh 11,650
          </del>
        </div>
      </div>
      <Badge className="absolute top-2 right-2 bg-destructive font-bold text-white">
        56% OFF
      </Badge>
    </Link>
  )
}
