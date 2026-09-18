"use client";

import Link from "next/link";
import { SeriesCard } from "@/components/series-card";
import type { CatalogSeries } from "@/lib/catalog";
import { cn } from "@/lib/utils";

interface SeriesRowProps {
  title: string;
  seriesList: CatalogSeries[];
  seeAllHref?: string;
  className?: string;
}

export function SeriesRow({
  title,
  seriesList,
  seeAllHref,
  className,
}: SeriesRowProps) {
  if (!seriesList.length) return null;

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            See all
          </Link>
        )}
      </div>

      <div className="relative">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2 sm:gap-4 sm:px-6 lg:px-8">
          {seriesList.map((item, idx) => (
            <div
              key={item.id}
              className="w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px] lg:w-[200px]"
            >
              <SeriesCard series={item} priority={idx < 4} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
