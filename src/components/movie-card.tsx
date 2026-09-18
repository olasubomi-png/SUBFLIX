"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalogMovie } from "@/lib/catalog";

interface MovieCardProps {
  movie: CatalogMovie;
  className?: string;
  priority?: boolean;
}

export function MovieCard({ movie, className, priority = false }: MovieCardProps) {
  const poster =
    movie.posterUrl ||
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop";
  const genreLabel =
    movie.genres && movie.genres.length > 0
      ? movie.genres[0].name
      : null;

  return (
    <Link
      href={`/movies/${movie.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-card transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-violet-900/20 focus-visible:ring-2 focus-visible:ring-violet-500",
        className
      )}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-card-hover">
        <Image
          src={poster}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={priority}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
        {movie.rating != null && movie.rating > 0 && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {Number(movie.rating).toFixed(1)}
          </div>
        )}
        {movie.isTrending && (
          <div className="absolute left-2 top-2 rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Trending
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted">
          {movie.releaseYear && <span>{movie.releaseYear}</span>}
          {movie.releaseYear && genreLabel && (
            <span className="h-1 w-1 rounded-full bg-muted" />
          )}
          {genreLabel && <span className="line-clamp-1">{genreLabel}</span>}
          {movie.ageRating && (
            <>
              <span className="h-1 w-1 rounded-full bg-muted" />
              <span>{movie.ageRating}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
