-- Phase 2 remaining: categories, people, cast, directors

CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "movie_categories" (
	"movie_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "movie_categories_movie_id_category_id_pk" PRIMARY KEY("movie_id","category_id")
);

CREATE TABLE IF NOT EXISTS "series_categories" (
	"series_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "series_categories_series_id_category_id_pk" PRIMARY KEY("series_id","category_id")
);

CREATE TABLE IF NOT EXISTS "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"photo_url" text,
	"biography" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "people_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "movie_cast" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"movie_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"character_name" text,
	"cast_order" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "series_cast" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"series_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"character_name" text,
	"cast_order" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "movie_directors" (
	"movie_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	CONSTRAINT "movie_directors_movie_id_person_id_pk" PRIMARY KEY("movie_id","person_id")
);

CREATE TABLE IF NOT EXISTS "series_directors" (
	"series_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	CONSTRAINT "series_directors_series_id_person_id_pk" PRIMARY KEY("series_id","person_id")
);

ALTER TABLE "movie_categories" ADD CONSTRAINT "movie_categories_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "movie_categories" ADD CONSTRAINT "movie_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "series_categories" ADD CONSTRAINT "series_categories_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "series_categories" ADD CONSTRAINT "series_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "movie_cast" ADD CONSTRAINT "movie_cast_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "movie_cast" ADD CONSTRAINT "movie_cast_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "series_cast" ADD CONSTRAINT "series_cast_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "series_cast" ADD CONSTRAINT "series_cast_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "movie_directors" ADD CONSTRAINT "movie_directors_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "movie_directors" ADD CONSTRAINT "movie_directors_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "series_directors" ADD CONSTRAINT "series_directors_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "series_directors" ADD CONSTRAINT "series_directors_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "people_name_idx" ON "people" USING btree ("name");
CREATE INDEX IF NOT EXISTS "movie_cast_movie_idx" ON "movie_cast" USING btree ("movie_id");
CREATE INDEX IF NOT EXISTS "movie_cast_person_idx" ON "movie_cast" USING btree ("person_id");
CREATE INDEX IF NOT EXISTS "series_cast_series_idx" ON "series_cast" USING btree ("series_id");
CREATE INDEX IF NOT EXISTS "series_cast_person_idx" ON "series_cast" USING btree ("person_id");
