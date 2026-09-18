import { eq, and, desc, asc, ilike, or, sql, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  movies,
  series,
  genres,
  movieGenres,
  seriesGenres,
  seasons,
  episodes,
} from "@/db/schema";

// ======================
// Types (DB-backed)
// ======================

export type CatalogMovie = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  releaseYear: number | null;
  runtime: number | null;
  ageRating: string | null;
  language: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  videoUrl: string | null;
  rating: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
  genres?: { id: string; name: string; slug: string }[];
};

export type CatalogSeries = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  releaseYear: number | null;
  ageRating: string | null;
  language: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  rating: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
  genres?: { id: string; name: string; slug: string }[];
  seasonsCount?: number;
};

export type CatalogGenre = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
};

export type CatalogSeason = {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string | null;
  description: string | null;
  posterUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  episodes?: CatalogEpisode[];
};

export type CatalogEpisode = {
  id: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  description: string | null;
  runtime: number | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  releaseDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function ensureDb() {
  if (!db) {
    throw new Error("Database is not configured. Set DATABASE_URL.");
  }
  return db;
}

function isDbAvailable(): boolean {
  return !!db;
}

// ======================
// Movies
// ======================

export async function getPublishedMovies(opts?: {
  limit?: number;
  offset?: number;
  featured?: boolean;
  trending?: boolean;
}): Promise<CatalogMovie[]> {
  if (!isDbAvailable()) return [];
  const database = ensureDb();
  const conditions = [eq(movies.isPublished, true)];

  if (opts?.featured) conditions.push(eq(movies.isFeatured, true));
  if (opts?.trending) conditions.push(eq(movies.isTrending, true));

  const rows = await database
    .select()
    .from(movies)
    .where(and(...conditions))
    .orderBy(desc(movies.createdAt))
    .limit(opts?.limit ?? 50)
    .offset(opts?.offset ?? 0);

  return rows as CatalogMovie[];
}

export async function getMovieBySlug(
  slug: string
): Promise<CatalogMovie | null> {
  if (!isDbAvailable()) return null;
  const database = ensureDb();
  const rows = await database
    .select()
    .from(movies)
    .where(and(eq(movies.slug, slug), eq(movies.isPublished, true)))
    .limit(1);

  if (rows.length === 0) return null;

  const movie = rows[0] as CatalogMovie;
  const genreRows = await database
    .select({
      id: genres.id,
      name: genres.name,
      slug: genres.slug,
    })
    .from(movieGenres)
    .innerJoin(genres, eq(movieGenres.genreId, genres.id))
    .where(eq(movieGenres.movieId, movie.id));

  movie.genres = genreRows;
  return movie;
}

export async function getMoviesByGenreSlug(
  genreSlug: string,
  limit = 50
): Promise<CatalogMovie[]> {
  if (!isDbAvailable()) return [];
  const database = ensureDb();
  const genre = await database
    .select()
    .from(genres)
    .where(eq(genres.slug, genreSlug))
    .limit(1);

  if (genre.length === 0) return [];

  const rows = await database
    .select({
      id: movies.id,
      title: movies.title,
      slug: movies.slug,
      description: movies.description,
      releaseYear: movies.releaseYear,
      runtime: movies.runtime,
      ageRating: movies.ageRating,
      language: movies.language,
      posterUrl: movies.posterUrl,
      backdropUrl: movies.backdropUrl,
      trailerUrl: movies.trailerUrl,
      videoUrl: movies.videoUrl,
      rating: movies.rating,
      isPublished: movies.isPublished,
      isFeatured: movies.isFeatured,
      isTrending: movies.isTrending,
      createdAt: movies.createdAt,
      updatedAt: movies.updatedAt,
    })
    .from(movieGenres)
    .innerJoin(movies, eq(movieGenres.movieId, movies.id))
    .where(
      and(
        eq(movieGenres.genreId, genre[0].id),
        eq(movies.isPublished, true)
      )
    )
    .orderBy(desc(movies.createdAt))
    .limit(limit);

  return rows as CatalogMovie[];
}

// ======================
// Series
// ======================

export async function getPublishedSeries(opts?: {
  limit?: number;
  offset?: number;
  featured?: boolean;
  trending?: boolean;
}): Promise<CatalogSeries[]> {
  if (!isDbAvailable()) return [];
  const database = ensureDb();
  const conditions = [eq(series.isPublished, true)];

  if (opts?.featured) conditions.push(eq(series.isFeatured, true));
  if (opts?.trending) conditions.push(eq(series.isTrending, true));

  const rows = await database
    .select()
    .from(series)
    .where(and(...conditions))
    .orderBy(desc(series.createdAt))
    .limit(opts?.limit ?? 50)
    .offset(opts?.offset ?? 0);

  return rows as CatalogSeries[];
}

export async function getSeriesBySlug(
  slug: string
): Promise<(CatalogSeries & { seasons: CatalogSeason[] }) | null> {
  if (!isDbAvailable()) return null;
  const database = ensureDb();
  const rows = await database
    .select()
    .from(series)
    .where(and(eq(series.slug, slug), eq(series.isPublished, true)))
    .limit(1);

  if (rows.length === 0) return null;

  const seriesItem = rows[0] as CatalogSeries;

  const genreRows = await database
    .select({
      id: genres.id,
      name: genres.name,
      slug: genres.slug,
    })
    .from(seriesGenres)
    .innerJoin(genres, eq(seriesGenres.genreId, genres.id))
    .where(eq(seriesGenres.seriesId, seriesItem.id));

  seriesItem.genres = genreRows;

  const seasonRows = await database
    .select()
    .from(seasons)
    .where(eq(seasons.seriesId, seriesItem.id))
    .orderBy(asc(seasons.seasonNumber));

  const seasonsWithEpisodes: CatalogSeason[] = [];

  for (const season of seasonRows) {
    const epRows = await database
      .select()
      .from(episodes)
      .where(
        and(
          eq(episodes.seasonId, season.id),
          eq(episodes.isPublished, true)
        )
      )
      .orderBy(asc(episodes.episodeNumber));

    seasonsWithEpisodes.push({
      ...(season as CatalogSeason),
      episodes: epRows as CatalogEpisode[],
    });
  }

  return {
    ...seriesItem,
    seasons: seasonsWithEpisodes,
  };
}

export async function getSeriesByGenreSlug(
  genreSlug: string,
  limit = 50
): Promise<CatalogSeries[]> {
  if (!isDbAvailable()) return [];
  const database = ensureDb();
  const genre = await database
    .select()
    .from(genres)
    .where(eq(genres.slug, genreSlug))
    .limit(1);

  if (genre.length === 0) return [];

  const rows = await database
    .select({
      id: series.id,
      title: series.title,
      slug: series.slug,
      description: series.description,
      releaseYear: series.releaseYear,
      ageRating: series.ageRating,
      language: series.language,
      posterUrl: series.posterUrl,
      backdropUrl: series.backdropUrl,
      trailerUrl: series.trailerUrl,
      rating: series.rating,
      isPublished: series.isPublished,
      isFeatured: series.isFeatured,
      isTrending: series.isTrending,
      createdAt: series.createdAt,
      updatedAt: series.updatedAt,
    })
    .from(seriesGenres)
    .innerJoin(series, eq(seriesGenres.seriesId, series.id))
    .where(
      and(
        eq(seriesGenres.genreId, genre[0].id),
        eq(series.isPublished, true)
      )
    )
    .orderBy(desc(series.createdAt))
    .limit(limit);

  return rows as CatalogSeries[];
}

// ======================
// Genres
// ======================

export async function getAllGenres(): Promise<CatalogGenre[]> {
  if (!isDbAvailable()) return [];
  const database = ensureDb();
  const rows = await database
    .select()
    .from(genres)
    .orderBy(asc(genres.name));
  return rows as CatalogGenre[];
}

export async function getGenreBySlug(
  slug: string
): Promise<CatalogGenre | null> {
  if (!isDbAvailable()) return null;
  const database = ensureDb();
  const rows = await database
    .select()
    .from(genres)
    .where(eq(genres.slug, slug))
    .limit(1);
  return rows.length > 0 ? (rows[0] as CatalogGenre) : null;
}

// ======================
// Search
// ======================

export async function searchCatalog(query: string, limit = 30): Promise<{
  movies: CatalogMovie[];
  series: CatalogSeries[];
}> {
  if (!isDbAvailable()) return { movies: [], series: [] };
  const database = ensureDb();
  const q = query.trim();
  if (!q) return { movies: [], series: [] };

  const pattern = `%${q}%`;

  const movieRows = await database
    .select()
    .from(movies)
    .where(
      and(
        eq(movies.isPublished, true),
        or(ilike(movies.title, pattern), ilike(movies.description, pattern))
      )
    )
    .orderBy(desc(movies.createdAt))
    .limit(limit);

  const seriesRows = await database
    .select()
    .from(series)
    .where(
      and(
        eq(series.isPublished, true),
        or(ilike(series.title, pattern), ilike(series.description, pattern))
      )
    )
    .orderBy(desc(series.createdAt))
    .limit(limit);

  return {
    movies: movieRows as CatalogMovie[],
    series: seriesRows as CatalogSeries[],
  };
}

// ======================
// Discovery helpers
// ======================

export async function getTrendingMovies(limit = 12): Promise<CatalogMovie[]> {
  return getPublishedMovies({ trending: true, limit });
}

export async function getFeaturedMovies(limit = 12): Promise<CatalogMovie[]> {
  return getPublishedMovies({ featured: true, limit });
}

export async function getNewMovies(limit = 12): Promise<CatalogMovie[]> {
  if (!isDbAvailable()) return [];
  const database = ensureDb();
  const rows = await database
    .select()
    .from(movies)
    .where(eq(movies.isPublished, true))
    .orderBy(desc(movies.releaseYear), desc(movies.createdAt))
    .limit(limit);
  return rows as CatalogMovie[];
}

export async function getTrendingSeries(limit = 12): Promise<CatalogSeries[]> {
  return getPublishedSeries({ trending: true, limit });
}

export async function getFeaturedSeries(limit = 12): Promise<CatalogSeries[]> {
  return getPublishedSeries({ featured: true, limit });
}

export async function getRelatedMovies(
  movieId: string,
  genreIds: string[],
  limit = 6
): Promise<CatalogMovie[]> {
  if (!isDbAvailable()) return [];
  if (genreIds.length === 0) {
    return getPublishedMovies({ limit });
  }

  const database = ensureDb();
  const rows = await database
    .select({
      id: movies.id,
      title: movies.title,
      slug: movies.slug,
      description: movies.description,
      releaseYear: movies.releaseYear,
      runtime: movies.runtime,
      ageRating: movies.ageRating,
      language: movies.language,
      posterUrl: movies.posterUrl,
      backdropUrl: movies.backdropUrl,
      trailerUrl: movies.trailerUrl,
      videoUrl: movies.videoUrl,
      rating: movies.rating,
      isPublished: movies.isPublished,
      isFeatured: movies.isFeatured,
      isTrending: movies.isTrending,
      createdAt: movies.createdAt,
      updatedAt: movies.updatedAt,
    })
    .from(movieGenres)
    .innerJoin(movies, eq(movieGenres.movieId, movies.id))
    .where(
      and(
        inArray(movieGenres.genreId, genreIds),
        eq(movies.isPublished, true),
        sql`${movies.id} != ${movieId}`
      )
    )
    .orderBy(desc(movies.createdAt))
    .limit(limit);

  return rows as CatalogMovie[];
}

export async function getCatalogStats(): Promise<{
  movies: number;
  series: number;
  genres: number;
}> {
  if (!isDbAvailable()) return { movies: 0, series: 0, genres: 0 };
  const database = ensureDb();
  const [m] = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(movies)
    .where(eq(movies.isPublished, true));
  const [s] = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(series)
    .where(eq(series.isPublished, true));
  const [g] = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(genres);

  return {
    movies: m?.count ?? 0,
    series: s?.count ?? 0,
    genres: g?.count ?? 0,
  };
}
