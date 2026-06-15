# Eurofit

A full-stack e-commerce platform for fitness equipment and products, built as a pnpm + Turborepo monorepo.

## Stack

| Layer           | Technology                             |
| --------------- | -------------------------------------- |
| Framework       | Next.js 16 + React 19                  |
| CMS / Backend   | Payload CMS v3                         |
| Database        | PostgreSQL (`@payloadcms/db-postgres`) |
| Styling         | Tailwind CSS v4                        |
| State (client)  | Jotai                                  |
| State (server)  | TanStack Query                         |
| Forms           | React Hook Form + Zod v4               |
| Payments        | Paystack                               |
| Email           | Resend                                 |
| File Storage    | Supabase S3                            |
| Bot Protection  | Cloudflare Turnstile                   |
| Package Manager | pnpm 10                                |
| Build System    | Turborepo                              |

## Monorepo Structure

```
eurofit/
├── apps/
│   └── www/                  # Next.js 16 + Payload CMS — main app
└── packages/
    ├── ui/                   # Shared shadcn/ui component library
    ├── transactional/        # React Email templates
    ├── eslint-config/        # Shared ESLint config
    └── typescript-config/    # Shared TypeScript config
```

## Prerequisites

- Node.js >= 20
- pnpm 10
- PostgreSQL database

## Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up environment variables**

   Copy `.env.example` to `apps/www/.env` and fill in all required values (see [Environment Variables](#environment-variables)).

3. **Run database migrations**

   ```bash
   pnpm --filter www payload migrate
   ```

4. **Start development server**

   ```bash
   pnpm www:dev        # www only (preferred)
   # or
   pnpm dev            # all apps
   ```

   The app runs at `http://localhost:3000`.
   Payload CMS admin is at `http://localhost:3000/payload/admin`.

## Environment Variables

All variables are validated at startup via `@t3-oss/env-nextjs` in `apps/www/src/env.mjs`.

| Variable                                             | Description                            |
| ---------------------------------------------------- | -------------------------------------- |
| `DATABASE_URI`                                       | PostgreSQL connection string           |
| `PAYLOAD_SECRET`                                     | Secret for Payload CMS (min 32 chars)  |
| `RESEND_API_KEY`                                     | Resend API key for transactional email |
| `SMTP_NO_REPLY_USERNAME`                             | From address for no-reply emails       |
| `SMTP_NO_REPLY_PASSWORD`                             | Password for no-reply SMTP account     |
| `SMTP_INFO_USERNAME`                                 | From address for info emails           |
| `SMTP_INFO_PASSWORD`                                 | Password for info SMTP account         |
| `SMTP_HOST`                                          | SMTP host                              |
| `SMTP_PORT`                                          | SMTP port                              |
| `PAYSTACK_SECRET_KEY`                                | Paystack secret key                    |
| `PAYSTACK_PUBLIC_KEY`                                | Paystack public key                    |
| `SUPABASE_S3_BUCKET`                                 | Supabase S3 bucket name                |
| `SUPABASE_S3_ACCESS_KEY_ID`                          | Supabase S3 access key                 |
| `SUPABASE_S3_SECRET_ACCESS_KEY`                      | Supabase S3 secret                     |
| `SUPABASE_S3_REGION`                                 | Supabase S3 region                     |
| `SUPABASE_S3_ENDPOINT`                               | Supabase S3 endpoint URL               |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY`                    | Managed Turnstile secret               |
| `CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY`          | Invisible Turnstile secret             |
| `NEXT_PUBLIC_APP_URL`                                | Public URL of the app                  |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY`           | Managed Turnstile site key             |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY` | Invisible Turnstile site key           |

## Commands

```bash
# Development
pnpm dev                    # all apps
pnpm www:dev                # www only (preferred)

# Quality
pnpm lint
pnpm typecheck
pnpm format

# Build
pnpm build

# Email preview (localhost:3333)
pnpm --filter @eurofit/transactional email

# Payload CMS
pnpm --filter www payload generate:types       # regenerate payload-types.ts
pnpm --filter www payload generate:importmap   # regenerate admin importMap.js
pnpm --filter www payload migrate:create       # create a new migration
pnpm --filter www payload migrate              # run pending migrations
```

## Features

### Storefront

- Product catalog with categories, brands, and search
- Product variant pages with filtering and sorting
- Shopping cart (persisted for both guests and authenticated users via a guest session cookie)
- Wishlist
- Checkout with Paystack payment integration
- Order history and PDF invoice generation
- Email verification, password reset, and account management

### Admin (Payload CMS)

- Full content management for products, variants, brands, and categories
- Media management backed by Supabase S3
- Order and transaction management
- Stock alert system
- Service area configuration
- Navigation and footer globals

### Guest Session

Every visitor receives a `_ef_g` cookie (30-day sliding expiry) managed by `src/proxy.ts`. Cart and wishlist persist without an account, associated to the guest session until the user authenticates.

## Collections

`users` · `addresses` · `media` · `packages` · `serviceAreas` · `brands` · `categories` · `products` · `productVariants` · `stockAlerts` · `wishlists` · `carts` · `orders` · `orderStatus` · `transactions`

## Route Structure (`apps/www`)

| Route Group           | Contents                                                                  |
| --------------------- | ------------------------------------------------------------------------- |
| `(frontend)/(bare)/`  | Auth pages: login, sign-up, forgot-password, reset-password, checkout     |
| `(frontend)/(store)/` | Storefront: home, brands, categories, products, search, orders, thank-you |
| `(payload)/`          | Payload CMS admin — auto-generated                                        |

## Payload CMS

- API mounted at `/payload/api`
- Config at `src/payload.config.ts`
- Types auto-generated at `src/payload-types.ts` — never edit manually
- All database IDs are UUIDs

## Commits

This repository enforces [Conventional Commits](https://www.conventionalcommits.org/) via commitlint + husky.

```
feat: add wishlist endpoint
fix(cart): handle empty cart edge case
chore: update dependencies
```
