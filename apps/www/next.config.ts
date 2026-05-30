import withPayload from "@payloadcms/next/withPayload"
import { redirects } from "./redirects"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@eurofit/ui"],
  redirects,
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ["./node_modules/@payloadcms/ui/dist/scss/"],
  },
}

export default withPayload(nextConfig)
