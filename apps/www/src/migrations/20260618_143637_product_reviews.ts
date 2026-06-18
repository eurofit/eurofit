import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "product_reviews" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"user_id" uuid NOT NULL,
  	"product_variant_id" uuid NOT NULL,
  	"rating" numeric NOT NULL,
  	"message" varchar,
  	"is_active" boolean DEFAULT true NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DROP INDEX "user_productVariant_idx";
  DROP INDEX "user_productVariant_1_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_reviews_id" uuid;
  ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_variant_id_product_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "product_reviews_user_idx" ON "product_reviews" USING btree ("user_id");
  CREATE INDEX "product_reviews_product_variant_idx" ON "product_reviews" USING btree ("product_variant_id");
  CREATE INDEX "product_reviews_updated_at_idx" ON "product_reviews" USING btree ("updated_at");
  CREATE INDEX "product_reviews_created_at_idx" ON "product_reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "user_productVariant_idx" ON "product_reviews" USING btree ("user_id","product_variant_id");
  CREATE INDEX "productVariant_idx" ON "product_reviews" USING btree ("product_variant_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_reviews_fk" FOREIGN KEY ("product_reviews_id") REFERENCES "public"."product_reviews"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "user_productVariant_1_idx" ON "stock_alerts" USING btree ("user_id","product_variant_id");
  CREATE UNIQUE INDEX "user_productVariant_2_idx" ON "wishlists" USING btree ("user_id","product_variant_id");
  CREATE INDEX "payload_locked_documents_rels_product_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("product_reviews_id");`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_reviews" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "product_reviews" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_reviews_fk";
  
  DROP INDEX "user_productVariant_1_idx";
  DROP INDEX "user_productVariant_2_idx";
  DROP INDEX "payload_locked_documents_rels_product_reviews_id_idx";
  CREATE UNIQUE INDEX "user_productVariant_idx" ON "stock_alerts" USING btree ("user_id","product_variant_id");
  CREATE UNIQUE INDEX "user_productVariant_1_idx" ON "wishlists" USING btree ("user_id","product_variant_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "product_reviews_id";`)
}
