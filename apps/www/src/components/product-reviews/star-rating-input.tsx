"use client"

import { cn } from "@eurofit/ui/lib/utils"
import { Star } from "lucide-react"
import * as React from "react"

type StarRatingInputProps = {
  value: number
  onChange: (value: number) => void
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hovered, setHovered] = React.useState(0)
  const active = hovered || value

  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="rounded-sm transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Star
            className={cn("size-7", {
              "fill-orange-400 text-orange-400": star <= active,
              "text-muted-foreground/40": star > active,
            })}
          />
        </button>
      ))}
    </div>
  )
}
