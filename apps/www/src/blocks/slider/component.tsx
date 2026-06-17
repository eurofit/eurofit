"use client"

import { ImageWithRetry } from "@/components/image-with-retry"
import { CarouselDots } from "@/components/ui/carousel"
import { useInView } from "@/hooks/use-in-view"
import { useIsMobile } from "@/hooks/use-mobile"
import { type SliderBlock } from "@/payload-types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@eurofit/ui/components/carousel"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"

export function Slider({
  slides,
  active,
  showArrows,
  showDots,
  snaps,
}: SliderBlock) {
  const isMobile = useIsMobile()
  const { ref, isInView } = useInView()

  const isActive = active && isInView && slides.length > 1
  const hasSlides = slides.length > 0
  const sizes = getSlideSizes(snaps)

  if (!hasSlides) {
    return null
  }

  return (
    <Carousel
      ref={ref}
      opts={{ loop: true, active: isActive }}
      plugins={[
        Autoplay({
          delay: 4000,
          stopOnInteraction: false,
        }),
      ]}
      className="relative aspect-[1.4/1] w-full rounded shadow select-none! md:aspect-4/1"
    >
      <CarouselContent className="h-full rounded">
        {slides.map(({ images, link }, index) => {
          const { desktopUrl, mobileUrl } = getImageSources(images)
          const isPriority = index < 3
          return (
            <CarouselItem
              key={index}
              className="relative h-full rounded"
              style={{
                flexBasis: getSnapBasis(snaps),
              }}
            >
              {desktopUrl && (
                <ImageWithRetry
                  src={desktopUrl}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={isPriority}
                  sizes={sizes}
                  className="hidden rounded object-cover md:block"
                />
              )}
              {mobileUrl && (
                <ImageWithRetry
                  src={mobileUrl}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={isPriority}
                  sizes={sizes}
                  className="rounded object-cover md:hidden"
                />
              )}
              {link && <Link href={link} className="absolute inset-0" />}
            </CarouselItem>
          )
        })}
      </CarouselContent>
      {hasSlides && showArrows && (
        <>
          <CarouselPrevious
            variant="default"
            className="-left-4"
            size={isMobile ? "icon" : "icon-lg"}
          />
          <CarouselNext
            variant="default"
            className="-right-4"
            size={isMobile ? "icon" : "icon-lg"}
          />
        </>
      )}
      {hasSlides && showDots && <CarouselDots className="-bottom-4" />}
    </Carousel>
  )
}

function getImageSources(images: SliderBlock["slides"][number]["images"]) {
  const resolveUrl = (
    image: SliderBlock["slides"][number]["images"][number]
  ) =>
    typeof image.image === "string" ? image.image : (image.image?.url ?? null)

  const defaultImage = images.find((img) => img.isDefault)
  const desktopImage = images.find((img) => !img.isMobile)
  const mobileImage = images.find((img) => img.isMobile)

  const desktopUrl =
    (desktopImage ? resolveUrl(desktopImage) : null) ??
    (defaultImage ? resolveUrl(defaultImage) : null)
  const mobileUrl =
    (mobileImage ? resolveUrl(mobileImage) : null) ??
    (defaultImage ? resolveUrl(defaultImage) : null) ??
    desktopUrl

  return { desktopUrl, mobileUrl }
}

function getSlideSizes(snaps: SliderBlock["snaps"]) {
  switch (snaps) {
    case "3":
      return "(max-width: 767px) 100vw, 33vw"
    default:
      return "100vw"
  }
}

function getSnapBasis(snaps: SliderBlock["snaps"]) {
  switch (snaps) {
    case "3":
      return "calc(100%/3)"
    default:
      return "100%"
  }
}
