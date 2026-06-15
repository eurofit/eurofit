import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "wishlists" RENAME COLUMN "customer_id" TO "user_id";
  ALTER TABLE "carts" RENAME COLUMN "customer_id" TO "user_id";
  ALTER TABLE "orders" RENAME COLUMN "customer_id" TO "user_id";
  ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_customer_id_users_id_fk";
  
  ALTER TABLE "carts" DROP CONSTRAINT "carts_customer_id_users_id_fk";
  
  ALTER TABLE "orders" DROP CONSTRAINT "orders_customer_id_users_id_fk";
  
  DROP INDEX "wishlists_customer_idx";
  DROP INDEX "customer_productVariant_idx";
  DROP INDEX "carts_customer_idx";
  DROP INDEX "orders_customer_idx";
  ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "wishlists_user_idx" ON "wishlists" USING btree ("user_id");
  CREATE UNIQUE INDEX "user_productVariant_1_idx" ON "wishlists" USING btree ("user_id","product_variant_id");
  CREATE UNIQUE INDEX "carts_user_idx" ON "carts" USING btree ("user_id");
  CREATE INDEX "orders_user_idx" ON "orders" USING btree ("user_id");`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_user_id_users_id_fk";
  
  ALTER TABLE "carts" DROP CONSTRAINT "carts_user_id_users_id_fk";
  
  ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_users_id_fk";
  
  DROP INDEX "wishlists_user_idx";
  DROP INDEX "user_productVariant_1_idx";
  DROP INDEX "carts_user_idx";
  DROP INDEX "orders_user_idx";
  ALTER TABLE "wishlists" ADD COLUMN "customer_id" uuid NOT NULL;
  ALTER TABLE "carts" ADD COLUMN "customer_id" uuid;
  ALTER TABLE "orders" ADD COLUMN "customer_id" uuid NOT NULL;
  ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "wishlists_customer_idx" ON "wishlists" USING btree ("customer_id");
  CREATE UNIQUE INDEX "customer_productVariant_idx" ON "wishlists" USING btree ("customer_id","product_variant_id");
  CREATE UNIQUE INDEX "carts_customer_idx" ON "carts" USING btree ("customer_id");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  ALTER TABLE "wishlists" DROP COLUMN "user_id";
  ALTER TABLE "carts" DROP COLUMN "user_id";
  ALTER TABLE "orders" DROP COLUMN "user_id";`)
}
