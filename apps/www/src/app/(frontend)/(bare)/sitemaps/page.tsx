import { site } from "@/const/site"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sitemaps",
  alternates: { canonical: `${site.url}/sitemaps` },
}

export default function SitemapsIndexPage() {
  return (
    <nav aria-label="Sitemaps index">
      <ul>
        <li>
          <a href="/sitemaps/brand-areas">Brand Areas Sitemap</a>
        </li>
      </ul>
    </nav>
  )
}
