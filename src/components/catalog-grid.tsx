import { MovieCard } from "@/components/movie-card";
import { SeriesCard } from "@/components/series-card";
import type { CatalogMovie, CatalogSeries } from "@/lib/catalog";
import { cn } from "@/lib/utils";

interface CatalogGridProps {
  movies?: CatalogMovie[];
  series?: CatalogSeries[];
  className?: string;
}

export function CatalogGrid({ movies, series, className }: CatalogGridProps) {
  const hasMovies = movies && movies.length > 0;
  const hasSeries = series && series.length > 0;

  if (!hasMovies && !hasSeries) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        className
      )}
    >
      {movies?.map((movie, idx) => (
        <MovieCard key={movie.id} movie={movie} priority={idx < 6} />
      ))}
      {series?.map((item, idx) => (
        <SeriesCard key={item.id} series={item} priority={idx < 6} />
      ))}
    </div>
  );
}
