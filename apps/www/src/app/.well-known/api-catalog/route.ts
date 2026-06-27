import { site } from "@/const/site"

// RFC 9727 API Catalog — served as application/linkset+json (RFC 9264)
export function GET() {
  return Response.json(
    {
      linkset: [
        {
          anchor: site.url,
          "service-desc": [
            { href: `${site.url}/sitemap.xml`, type: "application/xml" },
          ],
          "service-doc": [
            { href: `${site.url}/sitemap.xml`, type: "application/xml" },
            {
              href: `${site.url}/.well-known/agent-skills/index.json`,
              type: "application/json",
            },
          ],
          status: [{ href: `${site.url}/api/healthz` }],
          search: [{ href: `${site.url}/search?q={query}`, type: "text/html" }],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/linkset+json",
        "Cache-Control": "public, max-age=86400",
      },
    }
  )
}
