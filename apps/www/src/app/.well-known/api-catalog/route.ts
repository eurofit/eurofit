import { site } from "@/const/site"

export function GET() {
  return Response.json(
    {
      apis: [
        {
          id: "sitemap",
          title: "EUROFIT Sitemap",
          description:
            "XML sitemap listing all product variants, categories, and brands available at EUROFIT",
          url: `${site.url}/sitemap.xml`,
          type: "sitemap",
        },
        {
          id: "search",
          title: "EUROFIT Product Search",
          description:
            "Search across sports nutrition products, supplements, and vitamins",
          url: `${site.url}/search?q={query}`,
          type: "search",
        },
        {
          id: "categories",
          title: "EUROFIT Categories",
          description: "Browse all product categories",
          url: `${site.url}/categories`,
        },
        {
          id: "brands",
          title: "EUROFIT Brands",
          description: "Browse all available supplement brands",
          url: `${site.url}/brands`,
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
      },
    }
  )
}
