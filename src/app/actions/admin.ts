"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/auth";
import { db } from "@/db";
import { slugify } from "@/lib/slug";
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

export type ActionResult = { error?: string; success?: boolean; id?: string };

function ensureDb() {
  if (!db) throw new Error("Database is not configured");
  return db;
}

async function assertAdmin() {
  try {
    await requireAdmin();
  } catch {
    throw new Error("Forbidden");
  }
}

const movieSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(300).optional(),
  description: z.string().max(10000).optional().nullable(),
  releaseYear: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  runtime: z.coerce.number().int().min(1).max(1000).optional().nullable(),
  ageRating: z.string().max(20).optional().nullable(),
  language: z.string().max(20).optional().nullable(),
  posterUrl: z.string().url().optional().nullable().or(z.literal("")),
  backdropUrl: z.string().url().optional().nullable().or(z.literal("")),
  trailerUrl: z.string().url().optional().nullable().or(z.literal("")),
  videoUrl: z.string().url().optional().nullable().or(z.literal("")),
  rating: z.coerce.number().min(0).max(10).optional().nullable(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  genreIds: z.array(z.string().uuid()).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  directorIds: z.array(z.string().uuid()).optional(),
  cast: z
    .array(
      z.object({
        personId: z.string().uuid(),
        characterName: z.string().max(200).optional().nullable(),
        castOrder: z.coerce.number().int().min(0).optional(),
      })
    )
    .optional(),
});

function emptyToNull(v: string | null | undefined) {
  if (v === undefined || v === null || v === "") return null;
  return v;
}

// ======================
// MOVIES
// ======================

export async function createMovieAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();

  const genreIds = formData.getAll("genreIds").map(String).filter(Boolean);
  const categoryIds = formData.getAll("categoryIds").map(String).filter(Boolean);
  const directorIds = formData.getAll("directorIds").map(String).filter(Boolean);

  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? "") || undefined,
    description: emptyToNull(String(formData.get("description") ?? "")),
    releaseYear: formData.get("releaseYear")
      ? Number(formData.get("releaseYear"))
      : null,
    runtime: formData.get("runtime") ? Number(formData.get("runtime")) : null,
    ageRating: emptyToNull(String(formData.get("ageRating") ?? "")),
    language: emptyToNull(String(formData.get("language") ?? "")) || "en",
    posterUrl: emptyToNull(String(formData.get("posterUrl") ?? "")),
    backdropUrl: emptyToNull(String(formData.get("backdropUrl") ?? "")),
    trailerUrl: emptyToNull(String(formData.get("trailerUrl") ?? "")),
    videoUrl: emptyToNull(String(formData.get("videoUrl") ?? "")),
    rating: formData.get("rating") ? Number(formData.get("rating")) : 0,
    isPublished: formData.get("isPublished") === "on" || formData.get("isPublished") === "true",
    isFeatured: formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
    isTrending: formData.get("isTrending") === "on" || formData.get("isTrending") === "true",
    genreIds,
    categoryIds,
    directorIds,
  };

  const parsed = movieSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);
  if (!slug) return { error: "Invalid slug" };

  const existing = await database
    .select({ id: movies.id })
    .from(movies)
    .where(eq(movies.slug, slug))
    .limit(1);
  if (existing.length) return { error: "A movie with this slug already exists" };

  try {
    const [row] = await database
      .insert(movies)
      .values({
        title: data.title,
        slug,
        description: data.description ?? null,
        releaseYear: data.releaseYear ?? null,
        runtime: data.runtime ?? null,
        ageRating: data.ageRating ?? null,
        language: data.language ?? "en",
        posterUrl: data.posterUrl || null,
        backdropUrl: data.backdropUrl || null,
        trailerUrl: data.trailerUrl || null,
        videoUrl: data.videoUrl || null,
        rating: data.rating ?? 0,
        isPublished: data.isPublished ?? false,
        isFeatured: data.isFeatured ?? false,
        isTrending: data.isTrending ?? false,
      })
      .returning({ id: movies.id });

    await syncMovieRelations(row.id, {
      genreIds: data.genreIds ?? [],
      categoryIds: data.categoryIds ?? [],
      directorIds: data.directorIds ?? [],
    });

    revalidatePath("/admin/movies");
    revalidatePath("/movies");
    revalidatePath("/");
    redirect(`/admin/movies/${row.id}/edit`);
  } catch (e) {
    console.error("[createMovie]", e);
    return { error: "Failed to create movie" };
  }
}

export async function updateMovieAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();

  const genreIds = formData.getAll("genreIds").map(String).filter(Boolean);
  const categoryIds = formData.getAll("categoryIds").map(String).filter(Boolean);
  const directorIds = formData.getAll("directorIds").map(String).filter(Boolean);

  const raw = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? "") || undefined,
    description: emptyToNull(String(formData.get("description") ?? "")),
    releaseYear: formData.get("releaseYear")
      ? Number(formData.get("releaseYear"))
      : null,
    runtime: formData.get("runtime") ? Number(formData.get("runtime")) : null,
    ageRating: emptyToNull(String(formData.get("ageRating") ?? "")),
    language: emptyToNull(String(formData.get("language") ?? "")) || "en",
    posterUrl: emptyToNull(String(formData.get("posterUrl") ?? "")),
    backdropUrl: emptyToNull(String(formData.get("backdropUrl") ?? "")),
    trailerUrl: emptyToNull(String(formData.get("trailerUrl") ?? "")),
    videoUrl: emptyToNull(String(formData.get("videoUrl") ?? "")),
    rating: formData.get("rating") ? Number(formData.get("rating")) : 0,
    isPublished: formData.get("isPublished") === "on" || formData.get("isPublished") === "true",
    isFeatured: formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
    isTrending: formData.get("isTrending") === "on" || formData.get("isTrending") === "true",
    genreIds,
    categoryIds,
    directorIds,
  };

  const parsed = movieSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);

  const dup = await database
    .select({ id: movies.id })
    .from(movies)
    .where(and(eq(movies.slug, slug)))
    .limit(1);
  if (dup.length && dup[0].id !== id) {
    return { error: "A movie with this slug already exists" };
  }

  try {
    await database
      .update(movies)
      .set({
        title: data.title,
        slug,
        description: data.description ?? null,
        releaseYear: data.releaseYear ?? null,
        runtime: data.runtime ?? null,
        ageRating: data.ageRating ?? null,
        language: data.language ?? "en",
        posterUrl: data.posterUrl || null,
        backdropUrl: data.backdropUrl || null,
        trailerUrl: data.trailerUrl || null,
        videoUrl: data.videoUrl || null,
        rating: data.rating ?? 0,
        isPublished: data.isPublished ?? false,
        isFeatured: data.isFeatured ?? false,
        isTrending: data.isTrending ?? false,
        updatedAt: new Date(),
      })
      .where(eq(movies.id, id));

    await syncMovieRelations(id, {
      genreIds: data.genreIds ?? [],
      categoryIds: data.categoryIds ?? [],
      directorIds: data.directorIds ?? [],
    });

    revalidatePath("/admin/movies");
    revalidatePath(`/admin/movies/${id}/edit`);
    revalidatePath("/movies");
    revalidatePath(`/movies/${slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("[updateMovie]", e);
    return { error: "Failed to update movie" };
  }
}

async function syncMovieRelations(
  movieId: string,
  rel: { genreIds: string[]; categoryIds: string[]; directorIds: string[] }
) {
  const database = ensureDb();
  await database.delete(movieGenres).where(eq(movieGenres.movieId, movieId));
  await database.delete(movieCategories).where(eq(movieCategories.movieId, movieId));
  await database.delete(movieDirectors).where(eq(movieDirectors.movieId, movieId));

  if (rel.genreIds.length) {
    await database.insert(movieGenres).values(
      rel.genreIds.map((genreId) => ({ movieId, genreId }))
    );
  }
  if (rel.categoryIds.length) {
    await database.insert(movieCategories).values(
      rel.categoryIds.map((categoryId) => ({ movieId, categoryId }))
    );
  }
  if (rel.directorIds.length) {
    await database.insert(movieDirectors).values(
      rel.directorIds.map((personId) => ({ movieId, personId }))
    );
  }
}

export async function deleteMovieAction(id: string): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  try {
    await database.delete(movies).where(eq(movies.id, id));
    revalidatePath("/admin/movies");
    revalidatePath("/movies");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("[deleteMovie]", e);
    return { error: "Failed to delete movie" };
  }
}

export async function toggleMovieFlagAction(
  id: string,
  flag: "isPublished" | "isFeatured" | "isTrending"
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const rows = await database.select().from(movies).where(eq(movies.id, id)).limit(1);
  if (!rows[0]) return { error: "Movie not found" };
  const current = rows[0][flag];
  await database
    .update(movies)
    .set({ [flag]: !current, updatedAt: new Date() })
    .where(eq(movies.id, id));
  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  revalidatePath("/");
  return { success: true };
}

// ======================
// SERIES
// ======================

export async function createSeriesAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required" };
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const genreIds = formData.getAll("genreIds").map(String).filter(Boolean);
  const categoryIds = formData.getAll("categoryIds").map(String).filter(Boolean);
  const directorIds = formData.getAll("directorIds").map(String).filter(Boolean);

  const existing = await database
    .select({ id: series.id })
    .from(series)
    .where(eq(series.slug, slug))
    .limit(1);
  if (existing.length) return { error: "A series with this slug already exists" };

  try {
    const [row] = await database
      .insert(series)
      .values({
        title,
        slug,
        description: emptyToNull(String(formData.get("description") ?? "")),
        releaseYear: formData.get("releaseYear")
          ? Number(formData.get("releaseYear"))
          : null,
        ageRating: emptyToNull(String(formData.get("ageRating") ?? "")),
        language: emptyToNull(String(formData.get("language") ?? "")) || "en",
        posterUrl: emptyToNull(String(formData.get("posterUrl") ?? "")),
        backdropUrl: emptyToNull(String(formData.get("backdropUrl") ?? "")),
        trailerUrl: emptyToNull(String(formData.get("trailerUrl") ?? "")),
        rating: formData.get("rating") ? Number(formData.get("rating")) : 0,
        isPublished:
          formData.get("isPublished") === "on" ||
          formData.get("isPublished") === "true",
        isFeatured:
          formData.get("isFeatured") === "on" ||
          formData.get("isFeatured") === "true",
        isTrending:
          formData.get("isTrending") === "on" ||
          formData.get("isTrending") === "true",
      })
      .returning({ id: series.id });

    await syncSeriesRelations(row.id, { genreIds, categoryIds, directorIds });
    revalidatePath("/admin/series");
    revalidatePath("/series");
    revalidatePath("/");
    redirect(`/admin/series/${row.id}/edit`);
  } catch (e) {
    console.error("[createSeries]", e);
    return { error: "Failed to create series" };
  }
}

export async function updateSeriesAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required" };
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const genreIds = formData.getAll("genreIds").map(String).filter(Boolean);
  const categoryIds = formData.getAll("categoryIds").map(String).filter(Boolean);
  const directorIds = formData.getAll("directorIds").map(String).filter(Boolean);

  const dup = await database
    .select({ id: series.id })
    .from(series)
    .where(eq(series.slug, slug))
    .limit(1);
  if (dup.length && dup[0].id !== id) {
    return { error: "A series with this slug already exists" };
  }

  try {
    await database
      .update(series)
      .set({
        title,
        slug,
        description: emptyToNull(String(formData.get("description") ?? "")),
        releaseYear: formData.get("releaseYear")
          ? Number(formData.get("releaseYear"))
          : null,
        ageRating: emptyToNull(String(formData.get("ageRating") ?? "")),
        language: emptyToNull(String(formData.get("language") ?? "")) || "en",
        posterUrl: emptyToNull(String(formData.get("posterUrl") ?? "")),
        backdropUrl: emptyToNull(String(formData.get("backdropUrl") ?? "")),
        trailerUrl: emptyToNull(String(formData.get("trailerUrl") ?? "")),
        rating: formData.get("rating") ? Number(formData.get("rating")) : 0,
        isPublished:
          formData.get("isPublished") === "on" ||
          formData.get("isPublished") === "true",
        isFeatured:
          formData.get("isFeatured") === "on" ||
          formData.get("isFeatured") === "true",
        isTrending:
          formData.get("isTrending") === "on" ||
          formData.get("isTrending") === "true",
        updatedAt: new Date(),
      })
      .where(eq(series.id, id));

    await syncSeriesRelations(id, { genreIds, categoryIds, directorIds });
    revalidatePath("/admin/series");
    revalidatePath(`/admin/series/${id}/edit`);
    revalidatePath("/series");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("[updateSeries]", e);
    return { error: "Failed to update series" };
  }
}

async function syncSeriesRelations(
  seriesId: string,
  rel: { genreIds: string[]; categoryIds: string[]; directorIds: string[] }
) {
  const database = ensureDb();
  await database.delete(seriesGenres).where(eq(seriesGenres.seriesId, seriesId));
  await database
    .delete(seriesCategories)
    .where(eq(seriesCategories.seriesId, seriesId));
  await database
    .delete(seriesDirectors)
    .where(eq(seriesDirectors.seriesId, seriesId));

  if (rel.genreIds.length) {
    await database.insert(seriesGenres).values(
      rel.genreIds.map((genreId) => ({ seriesId, genreId }))
    );
  }
  if (rel.categoryIds.length) {
    await database.insert(seriesCategories).values(
      rel.categoryIds.map((categoryId) => ({ seriesId, categoryId }))
    );
  }
  if (rel.directorIds.length) {
    await database.insert(seriesDirectors).values(
      rel.directorIds.map((personId) => ({ seriesId, personId }))
    );
  }
}

export async function deleteSeriesAction(id: string): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  try {
    await database.delete(series).where(eq(series.id, id));
    revalidatePath("/admin/series");
    revalidatePath("/series");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("[deleteSeries]", e);
    return { error: "Failed to delete series" };
  }
}

export async function toggleSeriesFlagAction(
  id: string,
  flag: "isPublished" | "isFeatured" | "isTrending"
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const rows = await database.select().from(series).where(eq(series.id, id)).limit(1);
  if (!rows[0]) return { error: "Series not found" };
  await database
    .update(series)
    .set({ [flag]: !rows[0][flag], updatedAt: new Date() })
    .where(eq(series.id, id));
  revalidatePath("/admin/series");
  revalidatePath("/series");
  revalidatePath("/");
  return { success: true };
}

// ======================
// SEASONS / EPISODES
// ======================

export async function createSeasonAction(
  seriesId: string,
  prevOrForm: ActionResult | FormData,
  maybeForm?: FormData
): Promise<ActionResult> {
  const formData = prevOrForm instanceof FormData ? prevOrForm : maybeForm!;
  await assertAdmin();
  const database = ensureDb();
  const seasonNumber = Number(formData.get("seasonNumber"));
  if (!seasonNumber || seasonNumber < 1) return { error: "Invalid season number" };

  try {
    await database.insert(seasons).values({
      seriesId,
      seasonNumber,
      title: emptyToNull(String(formData.get("title") ?? "")),
      description: emptyToNull(String(formData.get("description") ?? "")),
      posterUrl: emptyToNull(String(formData.get("posterUrl") ?? "")),
    });
    revalidatePath(`/admin/series/${seriesId}/seasons`);
    return { success: true };
  } catch (e) {
    console.error("[createSeason]", e);
    return { error: "Failed to create season (duplicate number?)" };
  }
}

export async function deleteSeasonAction(
  seriesId: string,
  seasonId: string
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const row = await database
    .select()
    .from(seasons)
    .where(and(eq(seasons.id, seasonId), eq(seasons.seriesId, seriesId)))
    .limit(1);
  if (!row[0]) return { error: "Season not found" };
  await database.delete(seasons).where(eq(seasons.id, seasonId));
  revalidatePath(`/admin/series/${seriesId}/seasons`);
  return { success: true };
}

export async function createEpisodeAction(
  seriesId: string,
  seasonId: string,
  prevOrForm: ActionResult | FormData,
  maybeForm?: FormData
): Promise<ActionResult> {
  const formData = prevOrForm instanceof FormData ? prevOrForm : maybeForm!;
  await assertAdmin();
  const database = ensureDb();
  const season = await database
    .select()
    .from(seasons)
    .where(and(eq(seasons.id, seasonId), eq(seasons.seriesId, seriesId)))
    .limit(1);
  if (!season[0]) return { error: "Season not found for this series" };

  const title = String(formData.get("title") ?? "").trim();
  const episodeNumber = Number(formData.get("episodeNumber"));
  if (!title) return { error: "Title is required" };
  if (!episodeNumber || episodeNumber < 1) return { error: "Invalid episode number" };

  try {
    await database.insert(episodes).values({
      seasonId,
      episodeNumber,
      title,
      description: emptyToNull(String(formData.get("description") ?? "")),
      runtime: formData.get("runtime") ? Number(formData.get("runtime")) : null,
      thumbnailUrl: emptyToNull(String(formData.get("thumbnailUrl") ?? "")),
      videoUrl: emptyToNull(String(formData.get("videoUrl") ?? "")),
      isPublished:
        formData.get("isPublished") === "on" ||
        formData.get("isPublished") === "true",
    });
    revalidatePath(
      `/admin/series/${seriesId}/seasons/${seasonId}/episodes`
    );
    return { success: true };
  } catch (e) {
    console.error("[createEpisode]", e);
    return { error: "Failed to create episode (duplicate number?)" };
  }
}

export async function deleteEpisodeAction(
  seriesId: string,
  seasonId: string,
  episodeId: string
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const season = await database
    .select()
    .from(seasons)
    .where(and(eq(seasons.id, seasonId), eq(seasons.seriesId, seriesId)))
    .limit(1);
  if (!season[0]) return { error: "Invalid season" };
  await database
    .delete(episodes)
    .where(and(eq(episodes.id, episodeId), eq(episodes.seasonId, seasonId)));
  revalidatePath(`/admin/series/${seriesId}/seasons/${seasonId}/episodes`);
  return { success: true };
}

// ======================
// GENRES / CATEGORIES / PEOPLE
// ======================

export async function createGenreAction(
  prevOrForm: ActionResult | FormData,
  maybeForm?: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const formData = prevOrForm instanceof FormData ? prevOrForm : maybeForm!;
  const database = ensureDb();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  try {
    await database.insert(genres).values({
      name,
      slug,
      description: emptyToNull(String(formData.get("description") ?? "")),
    });
    revalidatePath("/admin/genres");
    revalidatePath("/genres");
    return { success: true };
  } catch {
    return { error: "Failed to create genre (duplicate?)" };
  }
}

export async function updateGenreAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  try {
    await database
      .update(genres)
      .set({
        name,
        slug,
        description: emptyToNull(String(formData.get("description") ?? "")),
      })
      .where(eq(genres.id, id));
    revalidatePath("/admin/genres");
    revalidatePath("/genres");
    return { success: true };
  } catch {
    return { error: "Failed to update genre" };
  }
}

export async function deleteGenreAction(id: string): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  await database.delete(genres).where(eq(genres.id, id));
  revalidatePath("/admin/genres");
  revalidatePath("/genres");
  return { success: true };
}

export async function createCategoryAction(
  prevOrForm: ActionResult | FormData,
  maybeForm?: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const formData = prevOrForm instanceof FormData ? prevOrForm : maybeForm!;
  const database = ensureDb();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  try {
    await database.insert(categories).values({
      name,
      slug,
      description: emptyToNull(String(formData.get("description") ?? "")),
    });
    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true };
  } catch {
    return { error: "Failed to create category (duplicate?)" };
  }
}

export async function updateCategoryAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  try {
    await database
      .update(categories)
      .set({
        name,
        slug,
        description: emptyToNull(String(formData.get("description") ?? "")),
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true };
  } catch {
    return { error: "Failed to update category" };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  await database.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: true };
}

export async function createPersonAction(
  prevOrForm: ActionResult | FormData,
  maybeForm?: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const formData = prevOrForm instanceof FormData ? prevOrForm : maybeForm!;
  const database = ensureDb();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  try {
    await database.insert(people).values({
      name,
      slug,
      photoUrl: emptyToNull(String(formData.get("photoUrl") ?? "")),
      biography: emptyToNull(String(formData.get("biography") ?? "")),
    });
    revalidatePath("/admin/people");
    return { success: true };
  } catch {
    return { error: "Failed to create person (duplicate slug?)" };
  }
}

export async function updatePersonAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };
  const slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  try {
    await database
      .update(people)
      .set({
        name,
        slug,
        photoUrl: emptyToNull(String(formData.get("photoUrl") ?? "")),
        biography: emptyToNull(String(formData.get("biography") ?? "")),
        updatedAt: new Date(),
      })
      .where(eq(people.id, id));
    revalidatePath("/admin/people");
    return { success: true };
  } catch {
    return { error: "Failed to update person" };
  }
}

export async function deletePersonAction(id: string): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  await database.delete(people).where(eq(people.id, id));
  revalidatePath("/admin/people");
  return { success: true };
}

// ======================
// USERS
// ======================

export async function updateUserRoleAction(
  userId: string,
  role: "user" | "admin"
): Promise<ActionResult> {
  const session = await requireAdmin();
  if (session.user.id === userId && role !== "admin") {
    return { error: "You cannot demote yourself" };
  }
  const database = ensureDb();
  await database
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, userId));
  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserActiveAction(
  userId: string
): Promise<ActionResult> {
  const session = await requireAdmin();
  if (session.user.id === userId) {
    return { error: "You cannot deactivate yourself" };
  }
  const database = ensureDb();
  const rows = await database
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!rows[0]) return { error: "User not found" };
  await database
    .update(users)
    .set({ isActive: !rows[0].isActive, updatedAt: new Date() })
    .where(eq(users.id, userId));
  revalidatePath("/admin/users");
  return { success: true };
}

// Cast helpers for movies
export async function addMovieCastAction(
  movieId: string,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const personId = String(formData.get("personId") ?? "");
  if (!personId) return { error: "Person is required" };
  const characterName = emptyToNull(String(formData.get("characterName") ?? ""));
  const castOrder = formData.get("castOrder")
    ? Number(formData.get("castOrder"))
    : 0;
  try {
    await database.insert(movieCast).values({
      movieId,
      personId,
      characterName,
      castOrder,
    });
    revalidatePath(`/admin/movies/${movieId}/edit`);
    return { success: true };
  } catch {
    return { error: "Failed to add cast member" };
  }
}

export async function removeMovieCastAction(
  movieId: string,
  castId: string
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  await database
    .delete(movieCast)
    .where(and(eq(movieCast.id, castId), eq(movieCast.movieId, movieId)));
  revalidatePath(`/admin/movies/${movieId}/edit`);
  return { success: true };
}

export async function addSeriesCastAction(
  seriesId: string,
  formData: FormData
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  const personId = String(formData.get("personId") ?? "");
  if (!personId) return { error: "Person is required" };
  try {
    await database.insert(seriesCast).values({
      seriesId,
      personId,
      characterName: emptyToNull(String(formData.get("characterName") ?? "")),
      castOrder: formData.get("castOrder")
        ? Number(formData.get("castOrder"))
        : 0,
    });
    revalidatePath(`/admin/series/${seriesId}/edit`);
    return { success: true };
  } catch {
    return { error: "Failed to add cast member" };
  }
}

export async function removeSeriesCastAction(
  seriesId: string,
  castId: string
): Promise<ActionResult> {
  await assertAdmin();
  const database = ensureDb();
  await database
    .delete(seriesCast)
    .where(and(eq(seriesCast.id, castId), eq(seriesCast.seriesId, seriesId)));
  revalidatePath(`/admin/series/${seriesId}/edit`);
  return { success: true };
}
