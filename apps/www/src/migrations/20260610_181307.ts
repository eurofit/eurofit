import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "packages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"is_active" boolean DEFAULT true NOT NULL,
  	"title" varchar NOT NULL,
  	"length" numeric NOT NULL,
  	"width" numeric NOT NULL,
  	"height" numeric NOT NULL,
  	"max_weight" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_areas_shipping_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"package_id" uuid NOT NULL,
  	"price" numeric NOT NULL
  );
  
  ALTER TABLE "service_areas" ADD COLUMN "delivery_time_min_days" numeric NOT NULL;
  ALTER TABLE "service_areas" ADD COLUMN "delivery_time_max_days" numeric NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "packages_id" uuid;
  ALTER TABLE "service_areas_shipping_rates" ADD CONSTRAINT "service_areas_shipping_rates_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_areas_shipping_rates" ADD CONSTRAINT "service_areas_shipping_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_areas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "packages_slug_idx" ON "packages" USING btree ("slug");
  CREATE UNIQUE INDEX "packages_title_idx" ON "packages" USING btree ("title");
  CREATE INDEX "packages_updated_at_idx" ON "packages" USING btree ("updated_at");
  CREATE INDEX "packages_created_at_idx" ON "packages" USING btree ("created_at");
  CREATE INDEX "service_areas_shipping_rates_order_idx" ON "service_areas_shipping_rates" USING btree ("_order");
  CREATE INDEX "service_areas_shipping_rates_parent_id_idx" ON "service_areas_shipping_rates" USING btree ("_parent_id");
  CREATE INDEX "service_areas_shipping_rates_package_idx" ON "service_areas_shipping_rates" USING btree ("package_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_packages_id_idx" ON "payload_locked_documents_rels" USING btree ("packages_id");`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_areas_shipping_rates" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "packages" CASCADE;
  DROP TABLE "service_areas_shipping_rates" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_packages_fk";
  
  DROP INDEX "payload_locked_documents_rels_packages_id_idx";
  ALTER TABLE "service_areas" DROP COLUMN "delivery_time_min_days";
  ALTER TABLE "service_areas" DROP COLUMN "delivery_time_max_days";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "packages_id";`)
}
