"use client"

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
      className="aspect-1.53/1 relative w-full rounded shadow select-none! md:aspect-4/1"
    >
      <CarouselContent className="h-full rounded">
        {slides.map(({ images, link }, index) => {
          const { defaultUrl, sources } = getImageSources(images)
          return (
            <CarouselItem
              key={index}
              className="rounded"
              style={{
                flexBasis: getSnapBasis(snaps),
              }}
            >
              <picture>
                {sources.map((src) => (
                  <source
                    key={src.srcSet}
                    srcSet={src.srcSet}
                    media={src.media}
                  />
                ))}

                <img
                  src={defaultUrl ?? undefined}
                  alt={`Slide ${index + 1}`}
                  className="size-full rounded object-cover"
                />
              </picture>
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
  const defaultImage = images.find((img) => img.isDefault)

  const sources = images
    .sort((a, b) => {
      if (a.isMobile && !b.isMobile) return -1
      if (!a.isMobile && b.isMobile) return 1
      return 0
    })
    .map(({ image, isMobile }) => ({
      srcSet: typeof image === "string" ? image : (image?.url ?? undefined),
      media: isMobile ? "(max-width: 767px)" : "(min-width: 768px)",
    }))

  return {
    defaultUrl:
      typeof defaultImage?.image === "string"
        ? defaultImage.image
        : defaultImage?.image?.url,
    sources,
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
