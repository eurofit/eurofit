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
        "relative flex w-full flex-col gap-3 rounded-lg p-3 transition-all duration-200 md:flex-row md:items-center md:gap-4",
        {
          "border-blue-300 bg-blue-50": isInCart || hasQuantity,
          "border-gray-200 bg-white hover:bg-gray-50":
            !variantHasPrice || !isInCart,
          "border-red-200 bg-red-50 hover:bg-red-50": variant.isOutOfStock,
        }
      )}
      aria-label={variant.title}
    >
      <div className="min-w-0 grow space-y-1">
        {variant.variant && (
          <Link href={`/product-variants/${variant.slug}`}>
            <h3
              id={variant.slug}
              className="scroll-m-20 font-medium text-pretty capitalize"
            >
              {variant.variant}
            </h3>
          </Link>
        )}

        <div className="flex items-center text-xs text-muted-foreground">
          {variant.sku && <p>SKU:&nbsp;{variant.sku}</p>}
          {variant.expiryDate && (
            <>
              {variant.sku && <span>&nbsp;&bull;&nbsp;</span>}
              <p>BBE:&nbsp;{format(variant.expiryDate, "dd/MM/yyyy")}</p>
            </>
          )}
        </div>

        <div className="!mt-2 flex items-center">
          <VariantStockStatus variant={variant} />
        </div>
      </div>

      <VariantActions variant={variant} userId={userId} />
    </div>
  )
}
