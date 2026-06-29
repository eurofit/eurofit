import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_product_list" ADD COLUMN "styles_card_bg" varchar;
  ALTER TABLE "pages_blocks_product_list" ADD COLUMN "styles_card_fg" varchar;`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_product_list" DROP COLUMN "styles_card_bg";
  ALTER TABLE "pages_blocks_product_list" DROP COLUMN "styles_card_fg";`)
}
