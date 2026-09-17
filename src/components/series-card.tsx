"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Series } from "@/data/mock";

interface SeriesCardProps {
  series: Series;
  className?: string;
}

export function SeriesCard({ series, className }: SeriesCardProps) {
  return (
    <Link
      href={`/series/${series.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-card transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-violet-900/20 focus-visible:ring-2 focus-visible:ring-violet-500",
        className
      )}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-card-hover">
        <Image
          src={series.poster}
          alt={series.title}
          fill
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {series.rating.toFixed(1)}
        </div>
        <div className="absolute bottom-2 left-2 rounded-md bg-violet-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          {series.seasons} Season{series.seasons > 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
          {series.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{series.year}</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span className="line-clamp-1">{series.genre}</span>
        </div>
      </div>
    </Link>
  );
}
