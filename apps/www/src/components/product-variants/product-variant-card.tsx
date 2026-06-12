"use client"

import { VariantActions } from "@/components/product-variants/variant-actions"
import { VariantStockStatus } from "@/components/product-variants/variant-stock-status"
import { useCartQuantity } from "@/hooks/use-cart-quantity"
import { type ProductVariant } from "@/types/product-variant"
import { cn } from "@eurofit/ui/lib/utils"
import { format } from "date-fns"
import Link from "next/link"

type ProductVariantCardProps = {
  variant: ProductVariant
  userId?: string | null
}

export function ProductVariantCard({
  userId,
  variant,
}: ProductVariantCardProps) {
  const { isInCart, hasQuantity } = useCartQuantity({ variant })
  const variantHasPrice = variant.price !== null

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-between rounded-lg p-3 transition-all duration-200 md:flex-row",
        {
          "border-blue-300 bg-blue-50": isInCart || hasQuantity,
          "border-gray-200 bg-white hover:bg-gray-50":
            !variantHasPrice || !isInCart,
          "border-red-200 bg-red-50 hover:bg-red-50": variant.isOutOfStock,
          "gap-4 max-md:flex-col max-md:items-start": variant.stock,
        }
      )}
      aria-label={variant.title}
    >
      <div className="w-full min-w-0 grow">
        <div className="mb-1 flex items-center gap-2">
          {variant.variant && (
            <Link href={`/product-variations/${variant.slug}`}>
              <h3
                id={variant.slug}
                className="max-w-xs scroll-m-20 font-medium text-pretty capitalize"
              >
                {variant.variant}
              </h3>
            </Link>
          )}
        </div>

        <div className="flex items-center">
          {variant.sku && (
            <p className="text-xs text-muted-foreground">
              SKU:&nbsp;{variant.sku}
            </p>
          )}
          {variant.expiryDate && (
            <>
              {variant.sku && <span>&nbsp;&bull;&nbsp;</span>}
              <p className="text-xs">
                BBE:&nbsp;{format(variant.expiryDate, "dd/MM/yyyy")}
              </p>
            </>
          )}
        </div>

        <div className="mt-3 flex items-center gap-3 text-sm">
          <VariantStockStatus variant={variant} />
        </div>
      </div>

      <VariantActions variant={variant} userId={userId} />
    </div>
  )
}
