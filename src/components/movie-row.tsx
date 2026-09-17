"use client";

import { MovieCard } from "@/components/movie-card";
import type { Movie } from "@/data/mock";
import { cn } from "@/lib/utils";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  className?: string;
}

export function MovieRow({ title, movies, className }: MovieRowProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
        <button className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
          See all
        </button>
      </div>

      <div className="relative">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2 sm:gap-4 sm:px-6 lg:px-8">
          {movies.map((movie, idx) => (
            <div
              key={movie.id}
              className="w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px] lg:w-[200px]"
            >
              <MovieCard movie={movie} priority={idx < 4} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
