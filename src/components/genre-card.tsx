"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CatalogGenre } from "@/lib/catalog";

const GENRE_COLORS = [
  "from-violet-600 to-purple-800",
  "from-indigo-600 to-blue-800",
  "from-fuchsia-600 to-pink-800",
  "from-rose-600 to-red-800",
  "from-amber-600 to-orange-800",
  "from-emerald-600 to-teal-800",
  "from-cyan-600 to-sky-800",
  "from-slate-600 to-zinc-800",
];

function colorForSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GENRE_COLORS[Math.abs(hash) % GENRE_COLORS.length];
}

interface GenreCardProps {
  genre: CatalogGenre;
  className?: string;
}

export function GenreCard({ genre, className }: GenreCardProps) {
  const gradient = colorForSlug(genre.slug);

  return (
    <Link
      href={`/genres/${genre.slug}`}
      className={cn(
        "group relative flex h-28 items-end overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-900/20 sm:h-32",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity group-hover:opacity-100",
          gradient
        )}
      />
      <div className="absolute inset-0 bg-black/20" />
      <h3 className="relative z-10 text-lg font-bold text-white drop-shadow-md">
        {genre.name}
      </h3>
    </Link>
  );
}
