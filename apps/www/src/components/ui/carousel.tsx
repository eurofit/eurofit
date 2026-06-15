"use client"

import { type EmblaCarouselType } from "embla-carousel"

import { Button } from "@eurofit/ui/components/button"
import { useCarousel } from "@eurofit/ui/components/carousel"
import { cn } from "@eurofit/ui/lib/utils"
import { useCallback, useEffect, useState } from "react"

type UseDotButtonType = {
  selectedIndex: number
  scrollSnaps: number[]
  onDotButtonClick: (index: number) => void
}

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi?.scrollSnapList() ?? [])
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi?.selectedScrollSnap() ?? 0)
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)

    emblaApi.on("reInit", onInit).on("select", onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  }
}

type CarouselDotsProps = React.ComponentProps<"div">

export const CarouselDots = ({ className, ...props }: CarouselDotsProps) => {
  const { api } = useCarousel()
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api)
  return (
    <div
      className={cn(
        "absolute bottom-2 left-1/2 z-2 flex -translate-x-1/2 items-center gap-2",
        className
      )}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          onClick={() => onDotButtonClick(index)}
          className={cn(
            "size-2.5 rounded-full bg-slate-900 hover:bg-slate-600",
            {
              "bg-red-500 hover:bg-red-300": index === selectedIndex,
            }
          )}
        />
      ))}
    </div>
  )
}
