import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_product_list" ALTER COLUMN "link_href" DROP NOT NULL;
  ALTER TABLE "pages_blocks_product_list" ALTER COLUMN "link_label" DROP NOT NULL;`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_product_list" ALTER COLUMN "link_href" SET NOT NULL;
  ALTER TABLE "pages_blocks_product_list" ALTER COLUMN "link_label" SET NOT NULL;`)
}
