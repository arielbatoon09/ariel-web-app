CREATE TYPE "public"."work_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "works" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"tag" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_src" text NOT NULL,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"link" text NOT NULL,
	"categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"case_study" jsonb NOT NULL,
	"seo" jsonb,
	"status" "work_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "works_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "works_slug_idx" ON "works" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "works_title_idx" ON "works" USING btree ("title");