"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { ContinueWatchingItem } from "@/data/mock";
import { cn } from "@/lib/utils";

interface ContinueWatchingProps {
  items: ContinueWatchingItem[];
  className?: string;
}

export function ContinueWatching({ items, className }: ContinueWatchingProps) {
  if (!items.length) return null;

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Continue Watching
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2 sm:px-6 lg:px-8">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}`}
            className="group relative w-[280px] flex-shrink-0 overflow-hidden rounded-xl bg-card transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-900/20 sm:w-[320px]"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="320px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl">
                  <Play className="h-6 w-6 fill-current" />
                </div>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                <div
                  className="h-full bg-violet-500 transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>

            <div className="p-3">
              <h3 className="line-clamp-1 font-semibold text-white group-hover:text-violet-300">
                {item.title}
              </h3>
              <p className="mt-0.5 text-xs text-muted">{item.episode}</p>
              <p className="mt-1 text-xs text-violet-400">{item.progress}% watched</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
