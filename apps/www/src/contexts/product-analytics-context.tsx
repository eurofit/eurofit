"use client"

import * as React from "react"

type ProductAnalyticsContext = {
  brand?: string | null
  categories?: string[]
}

const ProductAnalyticsContext =
  React.createContext<ProductAnalyticsContext | null>(null)

export function ProductAnalyticsProvider({
  children,
  brand,
  categories,
}: ProductAnalyticsContext & { children: React.ReactNode }) {
  const value = React.useMemo(
    () => ({ brand, categories }),
    [brand, categories]
  )
  return (
    <ProductAnalyticsContext.Provider value={value}>
      {children}
    </ProductAnalyticsContext.Provider>
  )
}

export function useProductAnalytics(): ProductAnalyticsContext {
  return React.useContext(ProductAnalyticsContext) ?? {}
}
