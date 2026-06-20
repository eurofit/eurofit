export type VariantDiscount = {
  /** Discounted price in KES (non-negative integer). */
  price: number
  /** The kind of "amount off" applied. */
  type: "percentage" | "fixed"
  /** The raw discount value (percent for "percentage", KES for "fixed"). */
  amount: number
  /** When the discount stops, if it has an end date. */
  endDate?: string | null
}

export type ProductVariant = {
  id: string
  sku: string
  slug: string
  title: string
  stock: number
  price: number | null
  discount: VariantDiscount | null
  expiryDate?: string | null
  variant?: string | null
  barcode?: string | null
  isPreorder: boolean
  isOutOfStock: boolean
  isLowStock: boolean
  isNotifyRequested: boolean
}
