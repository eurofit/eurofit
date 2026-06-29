import { ensureGuestSession } from "@/lib/utils/ensure-guest-session"
import { type NextRequest, NextResponse } from "next/server"

function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return btoa(String.fromCharCode(...bytes))
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== "production"

  const supabaseOrigin = (() => {
    try {
      return new URL(process.env.SUPABASE_S3_ENDPOINT ?? "").origin
    } catch {
      return ""
    }
  })()

  const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    supabaseOrigin,
    "https://www.tropicanawholesale.com",
    "https://images.unsplash.com",
  ]
    .filter(Boolean)
    .join(" ")

  const connectSrc = [
    "'self'",
    "https://*.ingest.sentry.io",
    "https://www.google-analytics.com",
    "https://analytics.google.com",
    "https://stats.g.doubleclick.net",
    "https://region1.analytics.google.com",
    isDev ? "ws://localhost:* wss://localhost:*" : "",
  ]
    .filter(Boolean)
    .join(" ")

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc}`,
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "worker-src blob:",
    "upgrade-insecure-requests",
  ]

  return directives.join("; ")
}

const ROBOTS_TXT = `User-agent: *
Content-Signal: search=yes, ai-train=no, ai-input=yes

User-Agent: Googlebot
Allow: /
Disallow: /admin

User-Agent: Bingbot
Allow: /
Disallow: /admin

User-Agent: SemrushBot
Disallow: /

User-Agent: PerplexityBot
Allow: /
Disallow: /admin

User-Agent: GPTBot
Allow: /
Disallow: /admin

User-Agent: ChatGPT-User
Allow: /
Disallow: /admin

User-Agent: ClaudeBot
Allow: /
Disallow: /admin

User-Agent: anthropic-ai
Allow: /
Disallow: /admin

User-Agent: Google-Extended
Allow: /
Disallow: /admin

User-Agent: *
Disallow: /admin
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /verify
`

const HOMEPAGE_MARKDOWN = `# EUROFIT – Sports Nutrition & Supplements Kenya

EUROFIT (Eurofit Health & Beauty LTD) is Kenya's leading supplier of authentic European sports nutrition, supplements, and vitamins for retail and wholesale customers.

## About

- **Legal name**: Eurofit Health & Beauty LTD
- **Location**: Seventh Street, Eastleigh, Nairobi, Kenya
- **Phone**: +254 110 990 666
- **Email**: info@eurofit.co.ke
- **Hours**: Monday–Saturday 09:00–18:00, Sunday 10:00–16:00
- **Payment**: Cash, M-Pesa, Bank Transfer
- **Currency**: KES

## Products

Authentic European brands across all major sports nutrition categories:

- Protein powders and mass gainers
- Pre-workout and energy supplements
- Amino acids and BCAAs
- Vitamins, minerals, and health supplements
- Weight management products
- Sports accessories

## Explore

- All categories: /categories
- All brands: /brands
- Contact: /contact-us
- Search products: /search

Wholesale and retail orders available. Fast delivery across Nairobi and Kenya.
`

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === "/robots.txt") {
    const origin = req.nextUrl.origin
    return new NextResponse(
      ROBOTS_TXT + `\nHost: ${origin}\nSitemap: ${origin}/sitemap.xml\n`,
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    )
  }

  const accept = req.headers.get("accept") ?? ""
  if (accept.includes("text/markdown") && pathname === "/") {
    return new NextResponse(HOMEPAGE_MARKDOWN, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
      },
    })
  }

  const nonce = generateNonce()
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-nonce", nonce)

  const res = NextResponse.next({ request: { headers: requestHeaders } })
  res.headers.set("Content-Security-Policy", buildCsp(nonce))
  ensureGuestSession(req, res)
  return res
}

export const config = {
  matcher: ["/((?!api|admin|_next/static|_next/image|.*\\.png$|.*\\.xml$).*)"],
}
