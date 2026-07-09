ALTER TABLE "services" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
CREATE INDEX "services_slug_idx" ON "services" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_slug_unique" UNIQUE("slug");