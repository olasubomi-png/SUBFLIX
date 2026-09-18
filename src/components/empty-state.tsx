import { Film, Search, Tv } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type EmptyVariant = "movies" | "series" | "search" | "genre" | "generic";

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

const icons = {
  movies: Film,
  series: Tv,
  search: Search,
  genre: Film,
  generic: Film,
};

export function EmptyState({
  variant = "generic",
  title,
  description,
  actionHref = "/movies",
  actionLabel = "Browse Movies",
}: EmptyStateProps) {
  const Icon = icons[variant];

  const defaults: Record<EmptyVariant, { title: string; description: string }> = {
    movies: {
      title: "No movies yet",
      description:
        "The catalog is empty. Published movies will appear here once they are added.",
    },
    series: {
      title: "No series yet",
      description:
        "The catalog is empty. Published series will appear here once they are added.",
    },
    search: {
      title: "No results found",
      description: "Try a different search term or browse the catalog.",
    },
    genre: {
      title: "Nothing in this genre",
      description: "No published movies or series are tagged with this genre yet.",
    },
    generic: {
      title: "Nothing here",
      description: "Content will appear once it is published.",
    },
  };

  const t = title ?? defaults[variant].title;
  const d = description ?? defaults[variant].description;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400">
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-white sm:text-2xl">{t}</h2>
      <p className="mt-2 max-w-md text-sm text-muted">{d}</p>
      {actionHref && (
        <Button asChild className="mt-6" variant="secondary">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
