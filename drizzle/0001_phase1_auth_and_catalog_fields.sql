-- Phase 1 Auth + Phase 2 Catalog schema enhancements
-- Generated for SUBFLIX

CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "sessions_user_idx" ON "sessions" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "sessions_token_idx" ON "sessions" USING btree ("token");

-- Movies enhancements
ALTER TABLE "movies" ADD COLUMN IF NOT EXISTS "video_url" text;
ALTER TABLE "movies" ADD COLUMN IF NOT EXISTS "is_featured" boolean DEFAULT false NOT NULL;
ALTER TABLE "movies" ADD COLUMN IF NOT EXISTS "is_trending" boolean DEFAULT false NOT NULL;

CREATE INDEX IF NOT EXISTS "movies_featured_idx" ON "movies" USING btree ("is_featured");
CREATE INDEX IF NOT EXISTS "movies_trending_idx" ON "movies" USING btree ("is_trending");

-- Series enhancements
ALTER TABLE "series" ADD COLUMN IF NOT EXISTS "is_featured" boolean DEFAULT false NOT NULL;
ALTER TABLE "series" ADD COLUMN IF NOT EXISTS "is_trending" boolean DEFAULT false NOT NULL;

CREATE INDEX IF NOT EXISTS "series_featured_idx" ON "series" USING btree ("is_featured");
CREATE INDEX IF NOT EXISTS "series_trending_idx" ON "series" USING btree ("is_trending");

-- Seasons enhancements
ALTER TABLE "seasons" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "seasons_series_number_idx" ON "seasons" USING btree ("series_id","season_number");

-- Episodes enhancements
ALTER TABLE "episodes" ADD COLUMN IF NOT EXISTS "release_date" timestamp with time zone;
ALTER TABLE "episodes" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "episodes_season_number_idx" ON "episodes" USING btree ("season_id","episode_number");
