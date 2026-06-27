import { site } from "@/const/site"
import { NextResponse } from "next/server"

const content = `# EUROFIT Agent Authentication

**${site.name}** (${site.url}) is a public e-commerce store for sports nutrition,
supplements, and vitamins in Kenya. Most resources require no authentication.

## Public Resources

All product browsing is publicly accessible:

- Product categories: ${site.url}/categories
- Brands: ${site.url}/brands
- Product search: ${site.url}/search?q={query}
- Sitemap: ${site.url}/sitemap.xml
- API catalog: ${site.url}/.well-known/api-catalog
- Agent skills: ${site.url}/.well-known/agent-skills/index.json

## Authenticated Actions

Account-specific actions (orders, wishlist, saved addresses) require a user
account. Agents acting on behalf of a user should direct them to:

- Login: ${site.url}/login
- Sign up: ${site.url}/sign-up

## Agent Registration

This site does not currently issue programmatic API credentials. Agents may
access all public resources without authentication tokens.

## Contact

- Phone: ${site.contact.phone.text}
- Email: ${site.contact.email.text}
- WhatsApp: https://wa.me/${site.contact.whatsapp}
`

export function GET() {
  return new NextResponse(content, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
