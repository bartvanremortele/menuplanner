ALTER TABLE "day_plan" ALTER COLUMN "label_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "week_day_config" ALTER COLUMN "label_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user';