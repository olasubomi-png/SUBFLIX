import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getGenreBySlug,
  getMoviesByGenreSlug,
  getSeriesByGenreSlug,
} from "@/lib/catalog";
import { CatalogGrid } from "@/components/catalog-grid";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const genre = await getGenreBySlug(slug);
    if (!genre) return { title: "Genre Not Found | SUBFLIX" };
    return {
      title: `${genre.name} | SUBFLIX`,
      description: genre.description ?? `Browse ${genre.name} on SUBFLIX`,
    };
  } catch {
    return { title: "Genre | SUBFLIX" };
  }
}

export default async function GenreDetailPage({ params }: Props) {
  const { slug } = await params;

  let genre;
  try {
    genre = await getGenreBySlug(slug);
  } catch {
    notFound();
  }

  if (!genre) notFound();

  let movies: Awaited<ReturnType<typeof getMoviesByGenreSlug>> = [];
  let seriesList: Awaited<ReturnType<typeof getSeriesByGenreSlug>> = [];

  try {
    [movies, seriesList] = await Promise.all([
      getMoviesByGenreSlug(slug, 50),
      getSeriesByGenreSlug(slug, 50),
    ]);
  } catch (e) {
    console.error("[genre detail]", e);
  }

  const isEmpty = movies.length === 0 && seriesList.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {genre.name}
        </h1>
        {genre.description && (
          <p className="mt-2 max-w-2xl text-muted">{genre.description}</p>
        )}
      </div>

      {isEmpty ? (
        <EmptyState variant="genre" actionHref="/genres" actionLabel="All Genres" />
      ) : (
        <div className="space-y-12">
          {movies.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">Movies</h2>
              <CatalogGrid movies={movies} />
            </section>
          )}
          {seriesList.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">Series</h2>
              <CatalogGrid series={seriesList} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
