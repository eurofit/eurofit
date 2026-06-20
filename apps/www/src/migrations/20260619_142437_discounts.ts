import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_discounts_discount_target" AS ENUM('product', 'free_shipping');
  CREATE TYPE "public"."enum_discounts_discount_method" AS ENUM('code', 'automatic');
  CREATE TYPE "public"."enum_discounts_product_discount_type" AS ENUM('amount_off', 'buy_x_get_y');
  CREATE TYPE "public"."enum_discounts_value_type" AS ENUM('percentage', 'fixed');
  CREATE TYPE "public"."enum_discounts_applies_to" AS ENUM('products');
  CREATE TYPE "public"."enum_discounts_get_discount_type" AS ENUM('percentage', 'amount_off_each', 'free');
  CREATE TYPE "public"."enum_discounts_eligibility" AS ENUM('all', 'tags', 'customers');
  CREATE TABLE "discounts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"is_active" boolean DEFAULT true NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"discount_target" "enum_discounts_discount_target" DEFAULT 'product' NOT NULL,
  	"discount_method" "enum_discounts_discount_method" DEFAULT 'code' NOT NULL,
  	"code" varchar,
  	"label" varchar,
  	"product_discount_type" "enum_discounts_product_discount_type" DEFAULT 'amount_off',
  	"value_type" "enum_discounts_value_type" DEFAULT 'percentage',
  	"discount_amount" numeric,
  	"applies_to" "enum_discounts_applies_to" DEFAULT 'products',
  	"buy_quantity" numeric,
  	"get_quantity" numeric,
  	"get_discount_type" "enum_discounts_get_discount_type" DEFAULT 'percentage',
  	"get_discount_amount" numeric,
  	"has_shipping_rate_limit" boolean DEFAULT false,
  	"max_shipping_rate" numeric,
  	"eligibility" "enum_discounts_eligibility" DEFAULT 'all' NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"should_set_end_date" boolean DEFAULT false,
  	"end_date" timestamp(3) with time zone,
  	"staff_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "discounts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"product_variants_id" uuid,
  	"service_areas_id" uuid,
  	"tags_id" uuid,
  	"users_id" uuid
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "discounts_id" uuid;
  ALTER TABLE "discounts" ADD CONSTRAINT "discounts_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "discounts_rels" ADD CONSTRAINT "discounts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."discounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "discounts_rels" ADD CONSTRAINT "discounts_rels_product_variants_fk" FOREIGN KEY ("product_variants_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "discounts_rels" ADD CONSTRAINT "discounts_rels_service_areas_fk" FOREIGN KEY ("service_areas_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "discounts_rels" ADD CONSTRAINT "discounts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "discounts_rels" ADD CONSTRAINT "discounts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "discounts_code_idx" ON "discounts" USING btree ("code");
  CREATE INDEX "discounts_staff_idx" ON "discounts" USING btree ("staff_id");
  CREATE INDEX "discounts_updated_at_idx" ON "discounts" USING btree ("updated_at");
  CREATE INDEX "discounts_created_at_idx" ON "discounts" USING btree ("created_at");
  CREATE INDEX "discounts_rels_order_idx" ON "discounts_rels" USING btree ("order");
  CREATE INDEX "discounts_rels_parent_idx" ON "discounts_rels" USING btree ("parent_id");
  CREATE INDEX "discounts_rels_path_idx" ON "discounts_rels" USING btree ("path");
  CREATE INDEX "discounts_rels_product_variants_id_idx" ON "discounts_rels" USING btree ("product_variants_id");
  CREATE INDEX "discounts_rels_service_areas_id_idx" ON "discounts_rels" USING btree ("service_areas_id");
  CREATE INDEX "discounts_rels_tags_id_idx" ON "discounts_rels" USING btree ("tags_id");
  CREATE INDEX "discounts_rels_users_id_idx" ON "discounts_rels" USING btree ("users_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_discounts_fk" FOREIGN KEY ("discounts_id") REFERENCES "public"."discounts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_discounts_id_idx" ON "payload_locked_documents_rels" USING btree ("discounts_id");`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "discounts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "discounts_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "discounts" CASCADE;
  DROP TABLE "discounts_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_discounts_fk";
  
  DROP INDEX "payload_locked_documents_rels_discounts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "discounts_id";
  DROP TYPE "public"."enum_discounts_discount_target";
  DROP TYPE "public"."enum_discounts_discount_method";
  DROP TYPE "public"."enum_discounts_product_discount_type";
  DROP TYPE "public"."enum_discounts_value_type";
  DROP TYPE "public"."enum_discounts_applies_to";
  DROP TYPE "public"."enum_discounts_get_discount_type";
  DROP TYPE "public"."enum_discounts_eligibility";`)
}
