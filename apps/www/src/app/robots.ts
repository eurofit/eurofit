import { site } from "@/const/site"
import { type MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin"],
      },
      { userAgent: ["Bingbot", "SemrushBot"], disallow: "/" },
      {
        userAgent: "*",
        disallow: [
          "/admin",
          "/login",
          "/signup",
          "/forgot-password",
          "/verify",
        ],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
