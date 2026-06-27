import { publicUrl } from "@/env.mjs"
import withPayload from "@payloadcms/next/withPayload"
import { withSentryConfig } from "@sentry/nextjs"
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
    qualities: [85],
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

export default withSentryConfig(withPayload(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "eurofit-health-beauty-ltd",

  project: "javascript",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
})
