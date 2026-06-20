"use client"

import { ImageWithRetry } from "@/components/image-with-retry"
import { VariantPrice } from "@/components/product-variants/variant-price"
import { FormattedCartItem } from "@/lib/utils/cart/formatCartItem"
import { normalizeVariantDiscount } from "@/lib/utils/discounts/normalize-variant-discount"
import { ImageOff } from "lucide-react"

type OrderItemProps = {
  item: FormattedCartItem
}

export function OrderItem({ item }: OrderItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border bg-background p-3">
      <div className="relative flex size-16 items-center justify-center rounded-md bg-muted">
        {item.product.image ? (
          <ImageWithRetry
            src={item.product.image}
            alt={item.product.title}
            width={64}
            height={64}
            className="m-auto max-h-11/12 max-w-11/12 rounded-md bg-white object-contain"
          />
        ) : (
          <ImageOff
            className="size-3/5 text-muted-foreground/50"
            aria-label="Image not available"
          />
        )}
      </div>
      <div>
        <h3 className="max-w-xs text-sm font-medium text-pretty">
          {item.product.title}
        </h3>
        <p className="text-sm text-muted-foreground">{item.variant}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Qty: {item.quantity}
        </p>
      </div>
      <div className="ml-auto text-right">
        <VariantPrice
          price={item.retailPrice ?? 0}
          discount={normalizeVariantDiscount(item.discount)}
          size="sm"
          className="items-end"
        />
      </div>
    </div>
  )
}
