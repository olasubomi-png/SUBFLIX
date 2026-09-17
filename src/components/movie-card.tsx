"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Movie } from "@/data/mock";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  priority?: boolean;
}

export function MovieCard({ movie, className, priority = false }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-card transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-violet-900/20 focus-visible:ring-2 focus-visible:ring-violet-500",
        className
      )}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-card-hover">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={priority}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
        {/* Rating badge */}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {movie.rating.toFixed(1)}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{movie.year}</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span className="line-clamp-1">{movie.genre}</span>
        </div>
      </div>
    </Link>
  );
}
