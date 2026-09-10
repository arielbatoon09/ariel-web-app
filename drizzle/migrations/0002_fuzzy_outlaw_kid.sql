CREATE TABLE "booking_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"slot_duration_minutes" integer DEFAULT 30 NOT NULL,
	"timezone" text DEFAULT 'Asia/Manila' NOT NULL,
	"weekly_hours" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discovery_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer,
	"guest_name" text NOT NULL,
	"guest_email" text NOT NULL,
	"guest_phone" text,
	"inquiry" text NOT NULL,
	"scheduled_start" timestamp with time zone NOT NULL,
	"scheduled_end" timestamp with time zone NOT NULL,
	"timezone" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "discovery_bookings" ADD CONSTRAINT "discovery_bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "discovery_bookings_status_idx" ON "discovery_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "discovery_bookings_scheduled_start_idx" ON "discovery_bookings" USING btree ("scheduled_start");--> statement-breakpoint
CREATE INDEX "discovery_bookings_guest_email_idx" ON "discovery_bookings" USING btree ("guest_email");--> statement-breakpoint
CREATE INDEX "discovery_bookings_user_id_idx" ON "discovery_bookings" USING btree ("user_id");--> statement-breakpoint
INSERT INTO "booking_settings" ("id", "slot_duration_minutes", "timezone", "weekly_hours")
VALUES (
  1,
  30,
  'Asia/Manila',
  '[
    {"dayOfWeek":0,"enabled":false,"startTime":"09:00","endTime":"17:30"},
    {"dayOfWeek":1,"enabled":true,"startTime":"09:00","endTime":"17:30"},
    {"dayOfWeek":2,"enabled":true,"startTime":"09:00","endTime":"17:30"},
    {"dayOfWeek":3,"enabled":true,"startTime":"09:00","endTime":"17:30"},
    {"dayOfWeek":4,"enabled":true,"startTime":"09:00","endTime":"17:30"},
    {"dayOfWeek":5,"enabled":true,"startTime":"09:00","endTime":"17:30"},
    {"dayOfWeek":6,"enabled":true,"startTime":"09:00","endTime":"17:30"}
  ]'::jsonb
)
ON CONFLICT ("id") DO NOTHING;