export type ProductVariant = {
  id: string
  sku: string
  slug: string
  title: string
  stock: number
  price: number | null
  expiryDate?: string | null
  variant?: string | null
  barcode?: string | null
  isPreorder: boolean
  isOutOfStock: boolean
  isLowStock: boolean
  isNotifyRequested: boolean
}
