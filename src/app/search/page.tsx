import type { Metadata } from "next";
import { searchCatalog } from "@/lib/catalog";
import { CatalogGrid } from "@/components/catalog-grid";
import { EmptyState } from "@/components/empty-state";
import { SearchForm } from "@/components/search-form";

export const metadata: Metadata = {
  title: "Search | SUBFLIX",
  description: "Search movies and series on SUBFLIX",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  let movies: Awaited<ReturnType<typeof searchCatalog>>["movies"] = [];
  let seriesList: Awaited<ReturnType<typeof searchCatalog>>["series"] = [];
  let error: string | null = null;

  if (query) {
    try {
      const result = await searchCatalog(query, 40);
      movies = result.movies;
      seriesList = result.series;
    } catch (e) {
      console.error("[search]", e);
      error = "Search is temporarily unavailable.";
    }
  }

  const hasResults = movies.length > 0 || seriesList.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Search
        </h1>
        <p className="mt-2 text-muted">Find movies and series</p>
      </div>

      <SearchForm initialQuery={query} />

      <div className="mt-10">
        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center text-red-300">
            {error}
          </div>
        ) : !query ? (
          <p className="text-center text-muted">
            Enter a title or keyword to search the catalog.
          </p>
        ) : !hasResults ? (
          <EmptyState
            variant="search"
            title={`No results for “${query}”`}
            actionHref="/movies"
            actionLabel="Browse Movies"
          />
        ) : (
          <div className="space-y-10">
            <p className="text-sm text-muted">
              {movies.length + seriesList.length} result
              {movies.length + seriesList.length !== 1 ? "s" : ""} for “{query}”
            </p>
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
    </div>
  );
}
