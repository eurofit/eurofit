import { publicUrl } from "@/env.mjs"
import withPayload from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"
import { redirects } from "./redirects"

const TROPICANA_URL = "https://www.tropicanawholesale.com"
const UNSPLASH_URL = "https://images.unsplash.com"

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  transpilePackages: ["@eurofit/ui", "@eurofit/transactional"],
  redirects,
  headers: async () => [
    {
      source: "/admin/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store, no-cache, no-transform" },
      ],
    },
    {
      source: "/payload/api/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store, no-cache, no-transform" },
      ],
    },
  ],
  images: {
    qualities: [100],
    remotePatterns: [
      ...[publicUrl, TROPICANA_URL, UNSPLASH_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(":", "") as "http" | "https",
        }
      }),
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ["./node_modules/@payloadcms/ui/dist/scss/"],
  },
}

export default withPayload(nextConfig)
