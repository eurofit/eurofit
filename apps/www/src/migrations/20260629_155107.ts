import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_fulfillment_type" AS ENUM('delivery', 'pickup');
  ALTER TABLE "orders" ALTER COLUMN "delivery_address_id" DROP NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "fulfillment_type" "enum_orders_fulfillment_type" DEFAULT 'delivery' NOT NULL;`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ALTER COLUMN "delivery_address_id" SET NOT NULL;
  ALTER TABLE "orders" DROP COLUMN "fulfillment_type";
  DROP TYPE "public"."enum_orders_fulfillment_type";`)
}
