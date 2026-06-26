import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "labels" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"is_active" boolean DEFAULT true NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "labels_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"product_variants_id" uuid
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "labels_id" uuid;
  ALTER TABLE "labels_rels" ADD CONSTRAINT "labels_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "labels_rels" ADD CONSTRAINT "labels_rels_product_variants_fk" FOREIGN KEY ("product_variants_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "labels_updated_at_idx" ON "labels" USING btree ("updated_at");
  CREATE INDEX "labels_created_at_idx" ON "labels" USING btree ("created_at");
  CREATE INDEX "labels_rels_order_idx" ON "labels_rels" USING btree ("order");
  CREATE INDEX "labels_rels_parent_idx" ON "labels_rels" USING btree ("parent_id");
  CREATE INDEX "labels_rels_path_idx" ON "labels_rels" USING btree ("path");
  CREATE INDEX "labels_rels_product_variants_id_idx" ON "labels_rels" USING btree ("product_variants_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_labels_fk" FOREIGN KEY ("labels_id") REFERENCES "public"."labels"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_labels_id_idx" ON "payload_locked_documents_rels" USING btree ("labels_id");`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "labels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "labels_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "labels" CASCADE;
  DROP TABLE "labels_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_labels_fk";
  
  DROP INDEX "payload_locked_documents_rels_labels_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "labels_id";`)
}
