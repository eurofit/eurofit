import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "carts_items" RENAME COLUMN "product_line_id" TO "product_variant_id";
  ALTER TABLE "carts_items" DROP CONSTRAINT "carts_items_product_line_id_product_variants_id_fk";
  
  DROP INDEX "carts_items_product_line_idx";
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_variant_id_product_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "carts_items_product_variant_idx" ON "carts_items" USING btree ("product_variant_id");`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "carts_items" DROP CONSTRAINT "carts_items_product_variant_id_product_variants_id_fk";
  
  DROP INDEX "carts_items_product_variant_idx";
  ALTER TABLE "carts_items" ADD COLUMN "product_line_id" uuid NOT NULL;
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_line_id_product_variants_id_fk" FOREIGN KEY ("product_line_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "carts_items_product_line_idx" ON "carts_items" USING btree ("product_line_id");
  ALTER TABLE "carts_items" DROP COLUMN "product_variant_id";`)
}
