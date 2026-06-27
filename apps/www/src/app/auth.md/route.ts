import { site } from "@/const/site"
import { NextResponse } from "next/server"

const content = `# Auth.md

Site: ${site.url}
Organization: ${site.legalName}

## About

${site.name} is a public e-commerce store for authentic European sports nutrition,
supplements, and vitamins in Kenya. Most resources are publicly accessible without
authentication.

## Public Resources

All product browsing requires no credentials:

- Categories: ${site.url}/categories
- Brands: ${site.url}/brands
- Product search: ${site.url}/search?q={query}
- Sitemap: ${site.url}/sitemap.xml
- API catalog: ${site.url}/.well-known/api-catalog
- Agent skills: ${site.url}/.well-known/agent-skills/index.json
- Health check: ${site.url}/api/healthz

## Authentication

Account-specific actions (orders, wishlist, saved addresses) require a registered
user account. Agents acting on behalf of a user should direct them to authenticate
at the login page before performing protected actions.

- Login: ${site.url}/login
- Register: ${site.url}/sign-up
- Authorization server: ${site.url}/.well-known/oauth-authorization-server
- Protected resource: ${site.url}/.well-known/oauth-protected-resource

## Agent Registration

This site does not currently issue programmatic OAuth credentials for agents.
Agents may access all public resources without tokens. For account-level access,
agents must act on behalf of a human user who has authenticated via the login page.

## Contact

- Phone: ${site.contact.phone.text}
- Email: ${site.contact.email.text}
- WhatsApp: https://wa.me/${site.contact.whatsapp}
- Contact page: ${site.url}/contact-us
`

export function GET() {
  return new NextResponse(content, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
