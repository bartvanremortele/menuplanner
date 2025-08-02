CREATE TABLE "day_plan" (
	"day" timestamp NOT NULL,
	"recipe_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"label_id" integer,
	CONSTRAINT "day_plan_day_user_id_recipe_id_pk" PRIMARY KEY("day","user_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "ingredient" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ingredient_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256) NOT NULL,
	"url" text,
	"kj" real,
	"kcal" real,
	"water" real,
	"eiwit" real,
	"koolhydraten" real,
	"suikers" real,
	"vet" real,
	"verzadigd_vet" real,
	"enkelvoudig_onverzadigd_vet" real,
	"meervoudig_onverzadigd_vet" real,
	"cholesterol" real,
	"voedingsvezel" real,
	"gevoel" real,
	"gezondheid" real
);
--> statement-breakpoint
CREATE TABLE "label" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "label_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "label_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "recipe" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipe_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"image_key" varchar(256),
	"created_by_user_id" text NOT NULL,
	CONSTRAINT "recipe_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredient" (
	"recipe_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"amount" real NOT NULL,
	"unit_abbr" varchar(10) NOT NULL,
	CONSTRAINT "recipe_ingredient_recipe_id_ingredient_id_pk" PRIMARY KEY("recipe_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_label_connection" (
	"recipe_id" integer NOT NULL,
	"label_id" integer NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"assigned_by_user_id" text NOT NULL,
	CONSTRAINT "recipe_label_connection_recipe_id_label_id_pk" PRIMARY KEY("recipe_id","label_id")
);
--> statement-breakpoint
CREATE TABLE "unit" (
	"abbr" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "week_day_config" (
	"week_day" integer NOT NULL,
	"label_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "week_day_config_week_day_user_id_label_id_pk" PRIMARY KEY("week_day","user_id","label_id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "day_plan" ADD CONSTRAINT "day_plan_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "day_plan" ADD CONSTRAINT "day_plan_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "day_plan" ADD CONSTRAINT "day_plan_label_id_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."label"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_ingredient_id_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredient"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_unit_abbr_unit_abbr_fk" FOREIGN KEY ("unit_abbr") REFERENCES "public"."unit"("abbr") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_label_connection" ADD CONSTRAINT "recipe_label_connection_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_label_connection" ADD CONSTRAINT "recipe_label_connection_label_id_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."label"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_label_connection" ADD CONSTRAINT "recipe_label_connection_assigned_by_user_id_user_id_fk" FOREIGN KEY ("assigned_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "week_day_config" ADD CONSTRAINT "week_day_config_label_id_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."label"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "week_day_config" ADD CONSTRAINT "week_day_config_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;