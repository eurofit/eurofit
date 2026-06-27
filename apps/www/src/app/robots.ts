import { site } from "@/const/site"
import { type MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const sensitiveRoutes = [
    "/admin",
    "/login",
    "/signup",
    "/forgot-password",
    "/verify",
  ]

  return {
    rules: [
      { userAgent: "Googlebot", allow: "/", disallow: ["/admin"] },
      { userAgent: "Bingbot", allow: "/", disallow: ["/admin"] },
      { userAgent: "SemrushBot", disallow: "/" },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin"] },
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin"] },
      { userAgent: "anthropic-ai", allow: "/", disallow: ["/admin"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin"] },
      { userAgent: "*", disallow: sensitiveRoutes },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
