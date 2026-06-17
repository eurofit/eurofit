"use client"

import { type ProductVariant } from "@/types/product-variant"
import { Separator } from "@eurofit/ui/components/separator"
import * as React from "react"
import { ProductVariantCard } from "./product-variant-card"

type ProductVariantsListProps = {
  productVariants: ProductVariant[]
  userId?: string | null
}

export function ProductVariantsList({
  productVariants,
  userId,
}: ProductVariantsListProps) {
  return (
    <div className="w-full space-y-3">
      {productVariants.map((variant, index) => (
        <React.Fragment key={variant.id}>
          <ProductVariantCard variant={variant} userId={userId} />
          {index < productVariants.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  )
}
