"use client"

import { Whatsapp } from "@/components/icons/whatsapp"
import { NotifyMeButton } from "@/components/stock-alert/notify-me-button"
import { site } from "@/const/site"
import { buildPriceInquiryMessage } from "@/lib/utils/build-price-inquiry-message"
import { buildWhatsAppLink } from "@/lib/utils/build-wa-link"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import type { ProductVariant } from "@/types/product-variant"
import { Button } from "@eurofit/ui/components/button"
import Link from "next/link"
import { QuantityInput } from "./quantity-input"

type VariantActionsProps = {
  variant: ProductVariant
  userId?: string | null
}

/**
 * Price + the single call-to-action for a variant. Exactly one action shows:
 * notify-me when out of stock, a quantity stepper when purchasable, or a
 * WhatsApp price inquiry when the variant has no listed price.
 */
export function VariantActions({ variant, userId }: VariantActionsProps) {
  const canPurchase = !variant.isOutOfStock && variant.price !== null
  const shouldInquirePrice = !variant.isOutOfStock && variant.price === null

  return (
    <div className="flex w-full flex-row items-center justify-between gap-3 md:w-auto md:flex-col md:items-end md:gap-2">
      {variant.price && (
        <span className="text-lg font-bold tabular-nums">
          <span className="text-muted-foreground">Ksh</span>
          {formatWithCommas(variant.price)}
        </span>
      )}

      {variant.isOutOfStock && (
        <NotifyMeButton
          userId={userId}
          productVariantId={variant.id}
          isNotifyRequested={variant.isNotifyRequested}
        />
      )}

      {canPurchase && <QuantityInput variant={variant} userId={userId} />}

      {shouldInquirePrice && (
        <Button variant="outline" className="text-whatsapp" asChild>
          <Link
            href={buildWhatsAppLink({
              phone: site.contact.whatsapp,
              message: buildPriceInquiryMessage(variant),
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Whatsapp aria-hidden="true" />
            Inquire Price
          </Link>
        </Button>
      )}
    </div>
  )
}
