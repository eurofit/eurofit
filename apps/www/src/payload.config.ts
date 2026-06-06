import { COOKIES_NAMESPACE } from "@/const/keys"
import { site } from "@/const/site"
import { env, publicUrl } from "@/env.mjs"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { resendAdapter } from "@payloadcms/email-resend"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { s3Storage } from "@payloadcms/storage-s3"
import path from "path"
import { buildConfig } from "payload"
import sharp from "sharp"
import { fileURLToPath } from "url"
import { collections } from "./collections"
import { users } from "./collections/users"
import { globals } from "./globals"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: publicUrl,
  cors: [publicUrl].filter(Boolean),
  cookiePrefix: COOKIES_NAMESPACE,
  admin: {
    user: users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dateFormat: "dd MMMM yyyy hh:mm",
  },
  routes: {
    api: "/payload/api",
  },
  collections,
  globals,
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI,
    },
    idType: "uuid",
    allowIDOnCreate: true,
    migrationDir: path.resolve(dirname, "./migrations"),
    generateSchemaOutputFile: path.resolve(
      dirname,
      "./payload-generated-schema.ts"
    ),
  }),
  email: resendAdapter({
    apiKey: env.RESEND_API_KEY,
    defaultFromAddress: env.SMTP_NO_REPLY_USERNAME,
    defaultFromName: site.name,
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
        },
      },
      bucket: env.SUPABASE_S3_BUCKET,
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: env.SUPABASE_S3_ACCESS_KEY_ID,
          secretAccessKey: env.SUPABASE_S3_SECRET_ACCESS_KEY,
        },
        region: env.SUPABASE_S3_REGION,
        endpoint: env.SUPABASE_S3_ENDPOINT,
      },
    }),
  ],
  sharp,
})
