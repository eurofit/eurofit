// @ts-check
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URI: z.string().min(1),
    PAYLOAD_SECRET: z
      .string()
      .min(32, "PAYLOAD_SECRET must be at least 32 characters"),
    SMTP_NO_REPLY_USERNAME: z.email(),
    SMTP_NO_REPLY_PASSWORD: z.string().min(1),
    SMTP_INFO_USERNAME: z.email(),
    SMTP_INFO_PASSWORD: z.string().min(1),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z
      .string()
      .min(1)
      .transform((val) => +val),
    PAYSTACK_SECRET_KEY: z.string().min(1),
    PAYSTACK_PUBLIC_KEY: z.string().min(1),
    SUPABASE_S3_BUCKET: z.string().min(1),
    SUPABASE_S3_ACCESS_KEY_ID: z.string().min(1),
    SUPABASE_S3_SECRET_ACCESS_KEY: z.string().min(1),
    SUPABASE_S3_REGION: z.string().min(1),
    SUPABASE_S3_ENDPOINT: z.string().min(1),
    CLOUDFLARE_TURNSTILE_SECRET_KEY: z.string().min(1),
    CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    CRON_SECRET: z
      .string()
      .min(16, "CRON_SECRET must be at least 16 characters"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY: z.string().min(1),
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY: z.string().min(1),
    NEXT_PUBLIC_SENTRY_DSN: z.string().min(1),
    NEXT_PUBLIC_GTM_ID: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DATABASE_URI: process.env.DATABASE_URI,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    SMTP_NO_REPLY_USERNAME: process.env.SMTP_NO_REPLY_USERNAME,
    SMTP_NO_REPLY_PASSWORD: process.env.SMTP_NO_REPLY_PASSWORD,
    SMTP_INFO_USERNAME: process.env.SMTP_INFO_USERNAME,
    SMTP_INFO_PASSWORD: process.env.SMTP_INFO_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
    SUPABASE_S3_BUCKET: process.env.SUPABASE_S3_BUCKET,
    SUPABASE_S3_ACCESS_KEY_ID: process.env.SUPABASE_S3_ACCESS_KEY_ID,
    SUPABASE_S3_SECRET_ACCESS_KEY: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
    SUPABASE_S3_REGION: process.env.SUPABASE_S3_REGION,
    SUPABASE_S3_ENDPOINT: process.env.SUPABASE_S3_ENDPOINT,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CRON_SECRET: process.env.CRON_SECRET,
    CLOUDFLARE_TURNSTILE_SECRET_KEY:
      process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY:
      process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY,
    CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY:
      process.env.CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY,
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY:
      process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  },
})

const vercelHost =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_VERCEL_URL
const vercelUrl = vercelHost ? `https://${vercelHost}` : undefined
const publicUrl = process.env.NEXT_PUBLIC_APP_URL || vercelUrl

if (!publicUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_APP_URL or NEXT_PUBLIC_VERCEL_URL variables!"
  )
}

// force type inference to string
const _publicUrl = publicUrl
export { _publicUrl as publicUrl }
