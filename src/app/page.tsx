import { Hero } from "@/components/hero";
import { MovieRow } from "@/components/movie-row";
import { SeriesRow } from "@/components/series-row";
import { GenreCard } from "@/components/genre-card";
import { EmptyState } from "@/components/empty-state";
import {
  getTrendingMovies,
  getFeaturedMovies,
  getNewMovies,
  getPublishedSeries,
  getTrendingSeries,
  getAllGenres,
  getCatalogStats,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let trendingMovies: Awaited<ReturnType<typeof getTrendingMovies>> = [];
  let featuredMovies: Awaited<ReturnType<typeof getFeaturedMovies>> = [];
  let newMovies: Awaited<ReturnType<typeof getNewMovies>> = [];
  let trendingSeries: Awaited<ReturnType<typeof getTrendingSeries>> = [];
  let recentSeries: Awaited<ReturnType<typeof getPublishedSeries>> = [];
  let genreList: Awaited<ReturnType<typeof getAllGenres>> = [];
  let stats = { movies: 0, series: 0, genres: 0 };
  let dbError = false;

  try {
    [
      trendingMovies,
      featuredMovies,
      newMovies,
      trendingSeries,
      recentSeries,
      genreList,
      stats,
    ] = await Promise.all([
      getTrendingMovies(12),
      getFeaturedMovies(12),
      getNewMovies(12),
      getTrendingSeries(12),
      getPublishedSeries({ limit: 12 }),
      getAllGenres(),
      getCatalogStats(),
    ]);
  } catch (e) {
    console.error("[home]", e);
    dbError = true;
  }

  const hasContent =
    trendingMovies.length > 0 ||
    featuredMovies.length > 0 ||
    newMovies.length > 0 ||
    trendingSeries.length > 0 ||
    recentSeries.length > 0;

  return (
    <div className="flex flex-col">
      <Hero />

      <div className="space-y-12 py-10 sm:space-y-16 sm:py-14">
        {dbError ? (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-8 text-center text-amber-200">
              Catalog is temporarily unavailable. Please try again later.
            </div>
          </div>
        ) : !hasContent ? (
          <EmptyState
            variant="generic"
            title="Catalog is empty"
            description="Published movies and series will appear here. Check back soon or explore once content is added."
            actionHref="/movies"
            actionLabel="Browse Movies"
          />
        ) : (
          <>
            {trendingMovies.length > 0 && (
              <MovieRow
                title="Trending Now"
                movies={trendingMovies}
                seeAllHref="/movies"
              />
            )}

            {featuredMovies.length > 0 && (
              <MovieRow
                title="Featured"
                movies={featuredMovies}
                seeAllHref="/movies"
              />
            )}

            {newMovies.length > 0 && (
              <MovieRow
                title="New Releases"
                movies={newMovies}
                seeAllHref="/movies"
              />
            )}

            {trendingSeries.length > 0 && (
              <SeriesRow
                title="Trending Series"
                seriesList={trendingSeries}
                seeAllHref="/series"
              />
            )}

            {recentSeries.length > 0 && trendingSeries.length === 0 && (
              <SeriesRow
                title="Popular Series"
                seriesList={recentSeries}
                seeAllHref="/series"
              />
            )}

            {genreList.length > 0 && (
              <section className="space-y-4">
                <div className="px-4 sm:px-6 lg:px-8">
                  <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Browse by Genre
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 md:grid-cols-4 lg:px-8">
                  {genreList.slice(0, 8).map((genre) => (
                    <GenreCard key={genre.id} genre={genre} />
                  ))}
                </div>
              </section>
            )}

            {stats.movies + stats.series > 0 && (
              <p className="px-4 text-center text-xs text-muted sm:px-6 lg:px-8">
                {stats.movies} movie{stats.movies !== 1 ? "s" : ""} ·{" "}
                {stats.series} series · {stats.genres} genre
                {stats.genres !== 1 ? "s" : ""}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
