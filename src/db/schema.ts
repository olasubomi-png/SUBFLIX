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
  uniqueIndex,
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
  pin: text("pin"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("sessions_user_idx").on(table.userId),
    index("sessions_token_idx").on(table.token),
  ]
);

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
    runtime: integer("runtime"),
    ageRating: text("age_rating"),
    language: text("language").default("en"),
    posterUrl: text("poster_url"),
    backdropUrl: text("backdrop_url"),
    trailerUrl: text("trailer_url"),
    videoUrl: text("video_url"),
    rating: real("rating").default(0),
    isPublished: boolean("is_published").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    isTrending: boolean("is_trending").notNull().default(false),
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
    index("movies_featured_idx").on(table.isFeatured),
    index("movies_trending_idx").on(table.isTrending),
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
    isFeatured: boolean("is_featured").notNull().default(false),
    isTrending: boolean("is_trending").notNull().default(false),
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
    index("series_featured_idx").on(table.isFeatured),
    index("series_trending_idx").on(table.isTrending),
  ]
);

export const seasons = pgTable(
  "seasons",
  {
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
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("seasons_series_number_idx").on(
      table.seriesId,
      table.seasonNumber
    ),
  ]
);

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
    videoUrl: text("video_url"),
    isPublished: boolean("is_published").notNull().default(false),
    releaseDate: timestamp("release_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("episodes_season_idx").on(table.seasonId),
    uniqueIndex("episodes_season_number_idx").on(
      table.seasonId,
      table.episodeNumber
    ),
  ]
);

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
// CATEGORIES
// ======================

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const movieCategories = pgTable(
  "movie_categories",
  {
    movieId: uuid("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.movieId, table.categoryId] })]
);

export const seriesCategories = pgTable(
  "series_categories",
  {
    seriesId: uuid("series_id")
      .notNull()
      .references(() => series.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.seriesId, table.categoryId] })]
);

// ======================
// PEOPLE / CAST / DIRECTORS
// ======================

export const people = pgTable(
  "people",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    photoUrl: text("photo_url"),
    biography: text("biography"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("people_name_idx").on(table.name)]
);

export const movieCast = pgTable(
  "movie_cast",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    movieId: uuid("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    characterName: text("character_name"),
    castOrder: integer("cast_order").notNull().default(0),
  },
  (table) => [
    index("movie_cast_movie_idx").on(table.movieId),
    index("movie_cast_person_idx").on(table.personId),
  ]
);

export const seriesCast = pgTable(
  "series_cast",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seriesId: uuid("series_id")
      .notNull()
      .references(() => series.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    characterName: text("character_name"),
    castOrder: integer("cast_order").notNull().default(0),
  },
  (table) => [
    index("series_cast_series_idx").on(table.seriesId),
    index("series_cast_person_idx").on(table.personId),
  ]
);

export const movieDirectors = pgTable(
  "movie_directors",
  {
    movieId: uuid("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.movieId, table.personId] })]
);

export const seriesDirectors = pgTable(
  "series_directors",
  {
    seriesId: uuid("series_id")
      .notNull()
      .references(() => series.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.seriesId, table.personId] })]
);

// ======================
// RELATIONS
// ======================

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
  sessions: many(sessions),
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

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  genres: many(movieGenres),
  categories: many(movieCategories),
  cast: many(movieCast),
  directors: many(movieDirectors),
}));

export const seriesRelations = relations(series, ({ many }) => ({
  seasons: many(seasons),
  genres: many(seriesGenres),
  categories: many(seriesCategories),
  cast: many(seriesCast),
  directors: many(seriesDirectors),
}));

export const seasonsRelations = relations(seasons, ({ one, many }) => ({
  series: one(series, {
    fields: [seasons.seriesId],
    references: [series.id],
  }),
  episodes: many(episodes),
}));

export const episodesRelations = relations(episodes, ({ one }) => ({
  season: one(seasons, {
    fields: [episodes.seasonId],
    references: [seasons.id],
  }),
}));

export const movieGenresRelations = relations(movieGenres, ({ one }) => ({
  movie: one(movies, {
    fields: [movieGenres.movieId],
    references: [movies.id],
  }),
  genre: one(genres, {
    fields: [movieGenres.genreId],
    references: [genres.id],
  }),
}));

export const seriesGenresRelations = relations(seriesGenres, ({ one }) => ({
  series: one(series, {
    fields: [seriesGenres.seriesId],
    references: [series.id],
  }),
  genre: one(genres, {
    fields: [seriesGenres.genreId],
    references: [genres.id],
  }),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  movies: many(movieGenres),
  series: many(seriesGenres),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  movies: many(movieCategories),
  series: many(seriesCategories),
}));

export const movieCategoriesRelations = relations(movieCategories, ({ one }) => ({
  movie: one(movies, {
    fields: [movieCategories.movieId],
    references: [movies.id],
  }),
  category: one(categories, {
    fields: [movieCategories.categoryId],
    references: [categories.id],
  }),
}));

export const seriesCategoriesRelations = relations(seriesCategories, ({ one }) => ({
  series: one(series, {
    fields: [seriesCategories.seriesId],
    references: [series.id],
  }),
  category: one(categories, {
    fields: [seriesCategories.categoryId],
    references: [categories.id],
  }),
}));

export const peopleRelations = relations(people, ({ many }) => ({
  movieCast: many(movieCast),
  seriesCast: many(seriesCast),
  movieDirectors: many(movieDirectors),
  seriesDirectors: many(seriesDirectors),
}));

export const movieCastRelations = relations(movieCast, ({ one }) => ({
  movie: one(movies, {
    fields: [movieCast.movieId],
    references: [movies.id],
  }),
  person: one(people, {
    fields: [movieCast.personId],
    references: [people.id],
  }),
}));

export const seriesCastRelations = relations(seriesCast, ({ one }) => ({
  series: one(series, {
    fields: [seriesCast.seriesId],
    references: [series.id],
  }),
  person: one(people, {
    fields: [seriesCast.personId],
    references: [people.id],
  }),
}));

export const movieDirectorsRelations = relations(movieDirectors, ({ one }) => ({
  movie: one(movies, {
    fields: [movieDirectors.movieId],
    references: [movies.id],
  }),
  person: one(people, {
    fields: [movieDirectors.personId],
    references: [people.id],
  }),
}));

export const seriesDirectorsRelations = relations(seriesDirectors, ({ one }) => ({
  series: one(series, {
    fields: [seriesDirectors.seriesId],
    references: [series.id],
  }),
  person: one(people, {
    fields: [seriesDirectors.personId],
    references: [people.id],
  }),
}));

