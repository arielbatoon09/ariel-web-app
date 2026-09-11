ALTER TABLE "services" ADD COLUMN "discount_type" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "discount_value" integer DEFAULT 0 NOT NULL;