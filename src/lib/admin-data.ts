import { eq, desc, asc, sql, count, ilike, and } from "drizzle-orm";
import { db } from "@/db";
import {
  movies,
  series,
  seasons,
  episodes,
  genres,
  categories,
  people,
  users,
  movieGenres,
  seriesGenres,
  movieCategories,
  seriesCategories,
  movieCast,
  seriesCast,
  movieDirectors,
  seriesDirectors,
} from "@/db/schema";

function ensureDb() {
  if (!db) throw new Error("Database is not configured");
  return db;
}

export async function getAdminStats() {
  const database = ensureDb();
  const [
    movieStats,
    seriesStats,
    seasonCount,
    episodeCount,
    genreCount,
    categoryCount,
    userCount,
    peopleCount,
  ] = await Promise.all([
    database
      .select({
        total: count(),
        published: sql<number>`count(*) filter (where ${movies.isPublished} = true)::int`,
      })
      .from(movies),
    database
      .select({
        total: count(),
        published: sql<number>`count(*) filter (where ${series.isPublished} = true)::int`,
      })
      .from(series),
    database.select({ c: count() }).from(seasons),
    database.select({ c: count() }).from(episodes),
    database.select({ c: count() }).from(genres),
    database.select({ c: count() }).from(categories),
    database.select({ c: count() }).from(users),
    database.select({ c: count() }).from(people),
  ]);

  const m = movieStats[0];
  const s = seriesStats[0];
  return {
    movies: {
      total: Number(m?.total ?? 0),
      published: Number(m?.published ?? 0),
      unpublished: Number(m?.total ?? 0) - Number(m?.published ?? 0),
    },
    series: {
      total: Number(s?.total ?? 0),
      published: Number(s?.published ?? 0),
      unpublished: Number(s?.total ?? 0) - Number(s?.published ?? 0),
    },
    seasons: Number(seasonCount[0]?.c ?? 0),
    episodes: Number(episodeCount[0]?.c ?? 0),
    genres: Number(genreCount[0]?.c ?? 0),
    categories: Number(categoryCount[0]?.c ?? 0),
    users: Number(userCount[0]?.c ?? 0),
    people: Number(peopleCount[0]?.c ?? 0),
  };
}

export async function listAdminMovies(opts?: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const database = ensureDb();
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;
  const conditions = [];
  if (opts?.search?.trim()) {
    conditions.push(ilike(movies.title, `%${opts.search.trim()}%`));
  }
  const where = conditions.length ? and(...conditions) : undefined;
  return database
    .select()
    .from(movies)
    .where(where)
    .orderBy(desc(movies.updatedAt))
    .limit(limit)
    .offset(offset);
}

export async function getAdminMovieById(id: string) {
  const database = ensureDb();
  const rows = await database.select().from(movies).where(eq(movies.id, id)).limit(1);
  if (!rows[0]) return null;
  const movie = rows[0];
  const [genreIds, categoryIds, castRows, directorIds] = await Promise.all([
    database
      .select({ genreId: movieGenres.genreId })
      .from(movieGenres)
      .where(eq(movieGenres.movieId, id)),
    database
      .select({ categoryId: movieCategories.categoryId })
      .from(movieCategories)
      .where(eq(movieCategories.movieId, id)),
    database
      .select()
      .from(movieCast)
      .where(eq(movieCast.movieId, id))
      .orderBy(asc(movieCast.castOrder)),
    database
      .select({ personId: movieDirectors.personId })
      .from(movieDirectors)
      .where(eq(movieDirectors.movieId, id)),
  ]);
  return {
    ...movie,
    genreIds: genreIds.map((g) => g.genreId),
    categoryIds: categoryIds.map((c) => c.categoryId),
    cast: castRows,
    directorIds: directorIds.map((d) => d.personId),
  };
}

export async function listAdminSeries(opts?: {
  search?: string;
  limit?: number;
}) {
  const database = ensureDb();
  const conditions = [];
  if (opts?.search?.trim()) {
    conditions.push(ilike(series.title, `%${opts.search.trim()}%`));
  }
  const where = conditions.length ? and(...conditions) : undefined;
  const rows = await database
    .select()
    .from(series)
    .where(where)
    .orderBy(desc(series.updatedAt))
    .limit(opts?.limit ?? 50);

  const withCounts = await Promise.all(
    rows.map(async (s) => {
      const [sc] = await database
        .select({ c: count() })
        .from(seasons)
        .where(eq(seasons.seriesId, s.id));
      return { ...s, seasonsCount: Number(sc?.c ?? 0) };
    })
  );
  return withCounts;
}

export async function getAdminSeriesById(id: string) {
  const database = ensureDb();
  const rows = await database.select().from(series).where(eq(series.id, id)).limit(1);
  if (!rows[0]) return null;
  const item = rows[0];
  const [genreIds, categoryIds, castRows, directorIds, seasonRows] =
    await Promise.all([
      database
        .select({ genreId: seriesGenres.genreId })
        .from(seriesGenres)
        .where(eq(seriesGenres.seriesId, id)),
      database
        .select({ categoryId: seriesCategories.categoryId })
        .from(seriesCategories)
        .where(eq(seriesCategories.seriesId, id)),
      database
        .select()
        .from(seriesCast)
        .where(eq(seriesCast.seriesId, id))
        .orderBy(asc(seriesCast.castOrder)),
      database
        .select({ personId: seriesDirectors.personId })
        .from(seriesDirectors)
        .where(eq(seriesDirectors.seriesId, id)),
      database
        .select()
        .from(seasons)
        .where(eq(seasons.seriesId, id))
        .orderBy(asc(seasons.seasonNumber)),
    ]);
  return {
    ...item,
    genreIds: genreIds.map((g) => g.genreId),
    categoryIds: categoryIds.map((c) => c.categoryId),
    cast: castRows,
    directorIds: directorIds.map((d) => d.personId),
    seasons: seasonRows,
  };
}

export async function listAdminSeasons(seriesId: string) {
  const database = ensureDb();
  const rows = await database
    .select()
    .from(seasons)
    .where(eq(seasons.seriesId, seriesId))
    .orderBy(asc(seasons.seasonNumber));
  return Promise.all(
    rows.map(async (s) => {
      const [ec] = await database
        .select({ c: count() })
        .from(episodes)
        .where(eq(episodes.seasonId, s.id));
      return { ...s, episodesCount: Number(ec?.c ?? 0) };
    })
  );
}

export async function listAdminEpisodes(seasonId: string) {
  const database = ensureDb();
  return database
    .select()
    .from(episodes)
    .where(eq(episodes.seasonId, seasonId))
    .orderBy(asc(episodes.episodeNumber));
}

export async function listAdminGenres() {
  const database = ensureDb();
  return database.select().from(genres).orderBy(asc(genres.name));
}

export async function listAdminCategories() {
  const database = ensureDb();
  return database.select().from(categories).orderBy(asc(categories.name));
}

export async function listAdminPeople(opts?: { search?: string }) {
  const database = ensureDb();
  const conditions = [];
  if (opts?.search?.trim()) {
    conditions.push(ilike(people.name, `%${opts.search.trim()}%`));
  }
  const where = conditions.length ? and(...conditions) : undefined;
  return database
    .select()
    .from(people)
    .where(where)
    .orderBy(asc(people.name))
    .limit(100);
}

export async function listAdminUsers() {
  const database = ensureDb();
  const rows = await database
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(100);
  return rows;
}

export async function getSeasonById(id: string) {
  const database = ensureDb();
  const rows = await database.select().from(seasons).where(eq(seasons.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getEpisodeById(id: string) {
  const database = ensureDb();
  const rows = await database.select().from(episodes).where(eq(episodes.id, id)).limit(1);
  return rows[0] ?? null;
}
