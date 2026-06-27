"use client"

import { useEffect } from "react"

type ModelContextNavigator = Navigator & {
  modelContext?: {
    provideContext: (ctx: unknown) => void
  }
}

export function WebMCP() {
  useEffect(() => {
    const nav = navigator as ModelContextNavigator
    if (!nav.modelContext) return

    nav.modelContext.provideContext({
      tools: [
        {
          name: "search_products",
          description:
            "Search EUROFIT's catalog of sports nutrition, supplements, and vitamins in Kenya",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "Product name, ingredient, or category to search for",
              },
            },
            required: ["query"],
          },
          execute: async ({ query }: { query: string }) => {
            const url = `/search?q=${encodeURIComponent(query)}`
            return { url, searchUrl: `${window.location.origin}${url}` }
          },
        },
        {
          name: "get_contact_info",
          description:
            "Get EUROFIT store contact details, physical address, and opening hours",
          inputSchema: { type: "object", properties: {} },
          execute: async () => ({
            name: "EUROFIT – Eurofit Health & Beauty LTD",
            phone: "+254 110 990 666",
            email: "info@eurofit.co.ke",
            whatsapp: "https://wa.me/254110990666",
            address: "Seventh Street, Eastleigh, Nairobi, Kenya",
            hours: {
              mondayToSaturday: "09:00–18:00",
              sunday: "10:00–16:00",
            },
            payment: ["Cash", "M-Pesa", "Bank Transfer"],
            currency: "KES",
          }),
        },
        {
          name: "get_categories",
          description: "List all product categories available at EUROFIT",
          inputSchema: { type: "object", properties: {} },
          execute: async () => {
            return {
              url: `${window.location.origin}/categories`,
              sitemap: `${window.location.origin}/sitemap.xml`,
            }
          },
        },
      ],
    })
  }, [])

  return null
}
