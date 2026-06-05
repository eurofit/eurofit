const vercelHost =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_VERCEL_URL
const vercelUrl = vercelHost ? `https://${vercelHost}` : undefined

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || vercelUrl

export { baseUrl }
