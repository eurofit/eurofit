import type { ProductVariant } from "@/types/product-variant"

type VariantStockStatusProps = {
  variant: ProductVariant
}

/** The single stock line: "Only N Left" / "N in Stock" / "Out of Stock". */
export function VariantStockStatus({ variant }: VariantStockStatusProps) {
  if (variant.isOutOfStock) {
    return <span className="text-sm text-gray-500">Out of Stock</span>
  }

  if (variant.isLowStock) {
    return (
      <span className="text-sm font-medium text-red-600 tabular-nums">
        Only {variant.stock} Left
      </span>
    )
  }

  return (
    <p className="text-sm text-green-600 tabular-nums">
      {variant.stock} in Stock
      {variant.isPreorder && (
        <span className="text-muted-foreground">&nbsp;(preorder)</span>
      )}
    </p>
  )
}
