import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_product_list" ADD COLUMN "link_href" varchar NOT NULL;
  ALTER TABLE "pages_blocks_product_list" ADD COLUMN "link_label" varchar DEFAULT 'View more' NOT NULL;
  ALTER TABLE "pages_blocks_product_list" DROP COLUMN "link";`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_product_list" ADD COLUMN "link" varchar;
  ALTER TABLE "pages_blocks_product_list" DROP COLUMN "link_href";
  ALTER TABLE "pages_blocks_product_list" DROP COLUMN "link_label";`)
}
