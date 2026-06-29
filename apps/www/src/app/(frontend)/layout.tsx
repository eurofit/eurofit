import { JsonLd } from "@/components/json-ld"
import { localBusiness, organization, website } from "@/const/json-ld"
import { site } from "@/const/site"
import { CurrentUserProvider } from "@/contexts/current-user-context"
import { env } from "@/env.mjs"
import { dmSans } from "@/fonts/dm-sans"
import { montserrat } from "@/fonts/montserrat"
import { JotaiProvider } from "@/providers/jotai"
import { ReactQueryProvider } from "@/providers/react-query"
import { Toaster } from "@eurofit/ui/components//sonner"
import "@eurofit/ui/globals.css"
import { GoogleTagManager } from "@next/third-parties/google"
import type { Metadata, Viewport } from "next"
import NextTopLoader from "nextjs-toploader"

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: "EUROFIT - Supplements & Sports Nutrition",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "EUROFIT – Sports Nutrition, Supplements & Vitamins in Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-image.jpg"],
  },
  other: {
    "apple-mobile-web-app-title": site.name,
  },
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gtmId = env.NEXT_PUBLIC_GTM_ID
  return (
    <html lang="en" className="scrollbar-gutter-stable">
      <GoogleTagManager gtmId={gtmId} />
      <body className={`${dmSans.variable} ${montserrat.variable} antialiased`}>
        {/* <!-- Google Tag Manager (noscript) --> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>
        {/* <!-- End Google Tag Manager (noscript) --> */}
        <JsonLd jsonLd={[organization, website, localBusiness]} />
        <Toaster richColors duration={8000} closeButton />
        <NextTopLoader
          showSpinner={false}
          color="#fb2c36"
          height={4}
          crawlSpeed={200}
          easing="ease"
          shadow="0 0 10px rgba(0, 0, 0, 0.1)"
          zIndex={9999}
          initialPosition={0.08}
          speed={200}
        />
        <JotaiProvider>
          <ReactQueryProvider>
            <CurrentUserProvider>{children}</CurrentUserProvider>
          </ReactQueryProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}
