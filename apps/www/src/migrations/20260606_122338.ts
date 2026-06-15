import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brands" RENAME COLUMN "supplier_image" TO "supplier_image_url";
  ALTER TABLE "brands" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brands" ADD COLUMN "supplier_image" varchar;
  ALTER TABLE "brands" DROP COLUMN "is_active";
  ALTER TABLE "brands" DROP COLUMN "supplier_image_url";`)
}
