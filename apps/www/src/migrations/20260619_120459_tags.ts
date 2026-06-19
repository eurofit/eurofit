import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tags_type" AS ENUM('product', 'product-variant', 'user');
  CREATE TABLE "tags" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"is_active" boolean DEFAULT true NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"type" "enum_tags_type" DEFAULT 'product' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" uuid,
  	"product_variants_id" uuid,
  	"users_id" uuid
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tags_id" uuid;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_product_variants_fk" FOREIGN KEY ("product_variants_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "tags_rels_order_idx" ON "tags_rels" USING btree ("order");
  CREATE INDEX "tags_rels_parent_idx" ON "tags_rels" USING btree ("parent_id");
  CREATE INDEX "tags_rels_path_idx" ON "tags_rels" USING btree ("path");
  CREATE INDEX "tags_rels_products_id_idx" ON "tags_rels" USING btree ("products_id");
  CREATE INDEX "tags_rels_product_variants_id_idx" ON "tags_rels" USING btree ("product_variants_id");
  CREATE INDEX "tags_rels_users_id_idx" ON "tags_rels" USING btree ("users_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tags_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tags_fk";
  
  DROP INDEX "payload_locked_documents_rels_tags_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tags_id";
  DROP TYPE "public"."enum_tags_type";`)
}
