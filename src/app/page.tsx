import { Hero } from "@/components/hero";
import { MovieRow } from "@/components/movie-row";
import { MovieCard } from "@/components/movie-card";
import { SeriesCard } from "@/components/series-card";
import { ContinueWatching } from "@/components/continue-watching";
import { GenreCard } from "@/components/genre-card";
import {
  trendingMovies,
  popularMovies,
  popularSeries,
  continueWatching,
  genres,
} from "@/data/mock";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />

      <div className="space-y-12 py-10 sm:space-y-16 sm:py-14">
        {/* Continue Watching */}
        <ContinueWatching items={continueWatching} />

        {/* Trending */}
        <MovieRow title="Trending Now" movies={trendingMovies} />

        {/* Popular Movies */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Popular Movies
            </h2>
            <button className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 md:grid-cols-4 lg:grid-cols-5 lg:px-8 xl:grid-cols-6">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Popular Series */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Popular Series
            </h2>
            <button className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 md:grid-cols-4 lg:grid-cols-5 lg:px-8 xl:grid-cols-6">
            {popularSeries.map((series) => (
              <SeriesCard key={series.id} series={series} />
            ))}
          </div>
        </section>

        {/* Genres */}
        <section className="space-y-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Browse by Genre
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {genres.map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
