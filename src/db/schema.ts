import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  real,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ======================
// USERS & AUTH
// ======================

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    name: text("name"),
    role: text("role", { enum: ["user", "admin"] })
      .notNull()
      .default("user"),
    isActive: boolean("is_active").notNull().default(true),
    emailVerified: boolean("email_verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("users_email_idx").on(table.email)]
);

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  isKids: boolean("is_kids").notNull().default(false),
  pin: text("pin"), // hashed if set
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ======================
// CONTENT
// ======================

export const genres = pgTable("genres", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const movies = pgTable(
  "movies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    releaseYear: integer("release_year"),
    runtime: integer("runtime"), // minutes
    ageRating: text("age_rating"),
    language: text("language").default("en"),
    posterUrl: text("poster_url"),
    backdropUrl: text("backdrop_url"),
    trailerUrl: text("trailer_url"),
    rating: real("rating").default(0),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("movies_slug_idx").on(table.slug),
    index("movies_published_idx").on(table.isPublished),
  ]
);

export const series = pgTable(
  "series",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    releaseYear: integer("release_year"),
    ageRating: text("age_rating"),
    language: text("language").default("en"),
    posterUrl: text("poster_url"),
    backdropUrl: text("backdrop_url"),
    trailerUrl: text("trailer_url"),
    rating: real("rating").default(0),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("series_slug_idx").on(table.slug),
    index("series_published_idx").on(table.isPublished),
  ]
);

export const seasons = pgTable("seasons", {
  id: uuid("id").defaultRandom().primaryKey(),
  seriesId: uuid("series_id")
    .notNull()
    .references(() => series.id, { onDelete: "cascade" }),
  seasonNumber: integer("season_number").notNull(),
  title: text("title"),
  description: text("description"),
  posterUrl: text("poster_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const episodes = pgTable(
  "episodes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    episodeNumber: integer("episode_number").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    runtime: integer("runtime"),
    thumbnailUrl: text("thumbnail_url"),
    videoUrl: text("video_url"), // will be signed later
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("episodes_season_idx").on(table.seasonId)]
);

// Many-to-many: movies <-> genres
export const movieGenres = pgTable(
  "movie_genres",
  {
    movieId: uuid("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    genreId: uuid("genre_id")
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.movieId, table.genreId] })]
);

// Many-to-many: series <-> genres
export const seriesGenres = pgTable(
  "series_genres",
  {
    seriesId: uuid("series_id")
      .notNull()
      .references(() => series.id, { onDelete: "cascade" }),
    genreId: uuid("genre_id")
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.seriesId, table.genreId] })]
);

// ======================
// USER ACTIVITY
// ======================

export const watchHistory = pgTable(
  "watch_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    profileId: uuid("profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    movieId: uuid("movie_id").references(() => movies.id, {
      onDelete: "cascade",
    }),
    episodeId: uuid("episode_id").references(() => episodes.id, {
      onDelete: "cascade",
    }),
    progressSeconds: integer("progress_seconds").notNull().default(0),
    durationSeconds: integer("duration_seconds"),
    completed: boolean("completed").notNull().default(false),
    lastWatchedAt: timestamp("last_watched_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("watch_history_user_idx").on(table.userId),
    index("watch_history_profile_idx").on(table.profileId),
  ]
);

export const watchlist = pgTable(
  "watchlist",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    profileId: uuid("profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    movieId: uuid("movie_id").references(() => movies.id, {
      onDelete: "cascade",
    }),
    seriesId: uuid("series_id").references(() => series.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("watchlist_user_idx").on(table.userId)]
);

// ======================
// SUBSCRIPTIONS
// ======================

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  plan: text("plan", {
    enum: ["free", "basic", "standard", "premium"],
  })
    .notNull()
    .default("free"),
  status: text("status", {
    enum: ["active", "canceled", "expired", "past_due"],
  })
    .notNull()
    .default("active"),
  paystackSubscriptionCode: text("paystack_subscription_code"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ======================
// RELATIONS (for Drizzle query API)
// ======================

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
  watchHistory: many(watchHistory),
  watchlist: many(watchlist),
  subscriptions: many(subscriptions),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  genres: many(movieGenres),
}));

export const seriesRelations = relations(series, ({ many }) => ({
  seasons: many(seasons),
  genres: many(seriesGenres),
}));

export const seasonsRelations = relations(seasons, ({ one, many }) => ({
  series: one(series, {
    fields: [seasons.seriesId],
    references: [series.id],
  }),
  episodes: many(episodes),
}));
