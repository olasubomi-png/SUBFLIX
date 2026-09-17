import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Genre } from "@/data/mock";

interface GenreCardProps {
  genre: Genre;
  className?: string;
}

export function GenreCard({ genre, className }: GenreCardProps) {
  return (
    <Link
      href={`/genres/${genre.slug}`}
      className={cn(
        "group relative flex h-28 items-end overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg sm:h-32",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity group-hover:opacity-100",
          genre.color
        )}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      <h3 className="relative z-10 text-lg font-bold text-white drop-shadow-md sm:text-xl">
        {genre.name}
      </h3>
    </Link>
  );
}
