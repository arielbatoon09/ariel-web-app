ALTER TABLE "orders" ADD COLUMN "reference_number" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_phone" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "requirements" text;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_reference_number_unique" UNIQUE("reference_number");