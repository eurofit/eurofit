import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "product_variants" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"is_active" boolean DEFAULT true NOT NULL,
  	"sku" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"detail_title" varchar,
  	"size" varchar,
  	"flavor_color" varchar,
  	"variant" varchar,
  	"product_id" uuid NOT NULL,
  	"category" varchar,
  	"supplier_price" numeric,
  	"supplier_discounted_price" numeric,
  	"price_fetched_at" timestamp(3) with time zone,
  	"cost_price" numeric,
  	"retail_price" numeric,
  	"stock" numeric DEFAULT 0 NOT NULL,
  	"supplier_stock" numeric,
  	"on_pallet" numeric,
  	"in_case" numeric,
  	"expiry_date" timestamp(3) with time zone,
  	"weight" numeric,
  	"serving_size_per_container" numeric,
  	"serving_size" numeric,
  	"supplier_product_code" varchar,
  	"barcode" varchar,
  	"export_commodity_code" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_variants_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" uuid
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_variants_id" uuid;
  ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_variants_rels" ADD CONSTRAINT "product_variants_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_variants_rels" ADD CONSTRAINT "product_variants_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "product_variants_slug_idx" ON "product_variants" USING btree ("slug");
  CREATE UNIQUE INDEX "product_variants_sku_idx" ON "product_variants" USING btree ("sku");
  CREATE INDEX "product_variants_title_idx" ON "product_variants" USING btree ("title");
  CREATE INDEX "product_variants_detail_title_idx" ON "product_variants" USING btree ("detail_title");
  CREATE INDEX "product_variants_product_idx" ON "product_variants" USING btree ("product_id");
  CREATE INDEX "product_variants_barcode_idx" ON "product_variants" USING btree ("barcode");
  CREATE INDEX "product_variants_updated_at_idx" ON "product_variants" USING btree ("updated_at");
  CREATE INDEX "product_variants_created_at_idx" ON "product_variants" USING btree ("created_at");
  CREATE INDEX "product_variants_rels_order_idx" ON "product_variants_rels" USING btree ("order");
  CREATE INDEX "product_variants_rels_parent_idx" ON "product_variants_rels" USING btree ("parent_id");
  CREATE INDEX "product_variants_rels_path_idx" ON "product_variants_rels" USING btree ("path");
  CREATE INDEX "product_variants_rels_media_id_idx" ON "product_variants_rels" USING btree ("media_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_variants_fk" FOREIGN KEY ("product_variants_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_product_variants_id_idx" ON "payload_locked_documents_rels" USING btree ("product_variants_id");`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_variants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_variants_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "product_variants" CASCADE;
  DROP TABLE "product_variants_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_variants_fk";
  
  DROP INDEX "payload_locked_documents_rels_product_variants_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "product_variants_id";`)
}
