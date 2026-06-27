import { site } from "@/const/site"

// RFC 9728 — declares this as a public resource requiring no authorization
export function GET() {
  return Response.json(
    {
      resource: site.url,
      authorization_servers: [],
      scopes_supported: [],
      bearer_methods_supported: [],
      resource_documentation: `${site.url}/.well-known/api-catalog`,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
      },
    }
  )
}
