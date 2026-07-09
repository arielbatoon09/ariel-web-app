CREATE TYPE "public"."article_status" AS ENUM('draft', 'published', 'unpublished');--> statement-breakpoint
CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"tag" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_src" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"link" text NOT NULL,
	"categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"date" text NOT NULL,
	"read_time" text NOT NULL,
	"author" text NOT NULL,
	"sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"seo" jsonb,
	"draft" jsonb,
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_title_idx" ON "articles" USING btree ("title");