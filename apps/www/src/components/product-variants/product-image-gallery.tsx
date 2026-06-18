"use client"

import { cn } from "@eurofit/ui/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProductImageGalleryProps {
  images: string[]
  productTitle: string
}

export function ProductImageGallery({
  images,
  productTitle,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onThumbnailClick = (index: number) => {
    setSelectedIndex(index)
  }

  const scrollPrev = () => {
    const newIndex = selectedIndex === 0 ? images.length - 1 : selectedIndex - 1
    setSelectedIndex(newIndex)
  }

  const scrollNext = () => {
    const newIndex = (selectedIndex + 1) % images.length
    setSelectedIndex(newIndex)
  }

  const showNav = images.length > 1

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-secondary">
        <div className="relative size-full">
          <Image
            src={images[selectedIndex]!}
            alt={`${productTitle} - Image ${selectedIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Navigation Arrows */}
        {showNav && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/90 p-2 transition-colors hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/90 p-2 transition-colors hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((thumbnail, index) => (
          <button
            key={index}
            onClick={() => onThumbnailClick(index)}
            className={cn(
              `relative size-20 shrink-0 overflow-hidden rounded-md border-2 p-1 transition-all`,
              {
                "border-primary": index === selectedIndex,
                "border-transparent": index !== selectedIndex,
              }
            )}
          >
            <Image
              src={thumbnail}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
