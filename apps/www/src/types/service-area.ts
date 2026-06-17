export type ServiceAreaShippingRate = {
  packageTitle: string
  price: number
}

export type ServiceAreaDetail = {
  slug: string
  title: string
  deliveryTime: {
    minDays: number
    maxDays: number
  }
  /** MIN of shippingRates[].price in KES, or null when no rates are configured. */
  lowestShippingRate: number | null
  /** Per-package delivery rates for this area, sorted ascending by price. */
  shippingRates: ServiceAreaShippingRate[]
}
