import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ADD COLUMN "estimated_delivery_min_date" timestamp(3) with time zone;
  ALTER TABLE "orders" ADD COLUMN "estimated_delivery_max_date" timestamp(3) with time zone;
  ALTER TABLE "orders" ADD COLUMN "ship_together" boolean DEFAULT true;`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" DROP COLUMN "estimated_delivery_min_date";
  ALTER TABLE "orders" DROP COLUMN "estimated_delivery_max_date";
  ALTER TABLE "orders" DROP COLUMN "ship_together";`)
}
