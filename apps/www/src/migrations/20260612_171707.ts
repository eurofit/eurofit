import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_addresses_title" AS ENUM('mr', 'ms', 'mrs', 'dr', 'prof');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('unpaid', 'paid', 'refunded');
  CREATE TYPE "public"."enum_order_statuses_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');
  CREATE TABLE "addresses" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"user_id" uuid,
  	"title" "enum_addresses_title" NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"secondary_phone" varchar,
  	"label" varchar,
  	"line1" varchar NOT NULL,
  	"line2" varchar,
  	"area" varchar,
  	"landmark" varchar,
  	"city" varchar NOT NULL,
  	"county" varchar NOT NULL,
  	"country" varchar DEFAULT 'Kenya' NOT NULL,
  	"postal_code" varchar NOT NULL,
  	"note" varchar,
  	"is_default" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" numeric NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_line_id" uuid NOT NULL,
  	"quantity" numeric NOT NULL,
  	"snapshot" jsonb NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" numeric PRIMARY KEY NOT NULL,
  	"customer_id" uuid NOT NULL,
  	"delivery_address_id" uuid NOT NULL,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'unpaid' NOT NULL,
  	"paystack_access_code" varchar,
  	"snapshot" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "order_statuses" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"order_id" numeric NOT NULL,
  	"staff_id" uuid NOT NULL,
  	"status" "enum_order_statuses_status" DEFAULT 'pending' NOT NULL,
  	"visible_to_customer" boolean DEFAULT true NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "transactions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"order_id" numeric NOT NULL,
  	"amount" numeric NOT NULL,
  	"ref" varchar NOT NULL,
  	"provider" varchar NOT NULL,
  	"is_test" boolean DEFAULT false,
  	"paid_at" timestamp(3) with time zone NOT NULL,
  	"snapshot" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "addresses_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "orders_id" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "order_statuses_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "transactions_id" uuid;
  ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_line_id_product_variants_id_fk" FOREIGN KEY ("product_line_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_address_id_addresses_id_fk" FOREIGN KEY ("delivery_address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_statuses" ADD CONSTRAINT "order_statuses_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_statuses" ADD CONSTRAINT "order_statuses_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "addresses_user_idx" ON "addresses" USING btree ("user_id");
  CREATE INDEX "addresses_updated_at_idx" ON "addresses" USING btree ("updated_at");
  CREATE INDEX "addresses_created_at_idx" ON "addresses" USING btree ("created_at");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_line_idx" ON "orders_items" USING btree ("product_line_id");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_delivery_address_idx" ON "orders" USING btree ("delivery_address_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "order_statuses_order_idx" ON "order_statuses" USING btree ("order_id");
  CREATE INDEX "order_statuses_staff_idx" ON "order_statuses" USING btree ("staff_id");
  CREATE INDEX "order_statuses_updated_at_idx" ON "order_statuses" USING btree ("updated_at");
  CREATE INDEX "order_statuses_created_at_idx" ON "order_statuses" USING btree ("created_at");
  CREATE INDEX "transactions_order_idx" ON "transactions" USING btree ("order_id");
  CREATE INDEX "transactions_updated_at_idx" ON "transactions" USING btree ("updated_at");
  CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_addresses_fk" FOREIGN KEY ("addresses_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_order_statuses_fk" FOREIGN KEY ("order_statuses_id") REFERENCES "public"."order_statuses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_addresses_id_idx" ON "payload_locked_documents_rels" USING btree ("addresses_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_order_statuses_id_idx" ON "payload_locked_documents_rels" USING btree ("order_statuses_id");
  CREATE INDEX "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");`)
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "addresses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "orders_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "orders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "order_statuses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "transactions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "addresses" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "order_statuses" CASCADE;
  DROP TABLE "transactions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_addresses_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_orders_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_order_statuses_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_transactions_fk";
  
  DROP INDEX "payload_locked_documents_rels_addresses_id_idx";
  DROP INDEX "payload_locked_documents_rels_orders_id_idx";
  DROP INDEX "payload_locked_documents_rels_order_statuses_id_idx";
  DROP INDEX "payload_locked_documents_rels_transactions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "addresses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "orders_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "order_statuses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "transactions_id";
  DROP TYPE "public"."enum_addresses_title";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_order_statuses_status";`)
}
