import type { Metadata } from "next";
import { getPublishedMovies } from "@/lib/catalog";
import { CatalogGrid } from "@/components/catalog-grid";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "Movies | SUBFLIX",
  description: "Browse the SUBFLIX movie catalog",
};

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  let movieList: Awaited<ReturnType<typeof getPublishedMovies>> = [];
  let error: string | null = null;

  try {
    movieList = await getPublishedMovies({ limit: 100 });
  } catch (e) {
    console.error("[movies page]", e);
    error = "Unable to load movies right now.";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Movies
        </h1>
        <p className="mt-2 text-muted">
          Discover films available on SUBFLIX
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center text-red-300">
          {error}
        </div>
      ) : movieList.length === 0 ? (
        <EmptyState variant="movies" actionHref="/" actionLabel="Back to Home" />
      ) : (
        <CatalogGrid movies={movieList} />
      )}
    </div>
  );
}
