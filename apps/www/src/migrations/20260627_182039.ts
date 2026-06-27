import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_product_list_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" uuid
  );
  
  CREATE TABLE "pages_blocks_product_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"timer" timestamp(3) with time zone,
  	"link" varchar,
  	"styles_header_bg" varchar,
  	"styles_header_fg" varchar,
  	"styles_content_bg" varchar,
  	"styles_content_fg" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_product_list_products" ADD CONSTRAINT "pages_blocks_product_list_products_product_id_product_variants_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_list_products" ADD CONSTRAINT "pages_blocks_product_list_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_list" ADD CONSTRAINT "pages_blocks_product_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_product_list_products_order_idx" ON "pages_blocks_product_list_products" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_list_products_parent_id_idx" ON "pages_blocks_product_list_products" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_list_products_product_idx" ON "pages_blocks_product_list_products" USING btree ("product_id");
  CREATE INDEX "pages_blocks_product_list_order_idx" ON "pages_blocks_product_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_list_parent_id_idx" ON "pages_blocks_product_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_list_path_idx" ON "pages_blocks_product_list" USING btree ("_path");`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_product_list_products" CASCADE;
  DROP TABLE "pages_blocks_product_list" CASCADE;`)
}
