import type { Metadata } from "next";
import { getAllGenres } from "@/lib/catalog";
import { GenreCard } from "@/components/genre-card";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "Genres | SUBFLIX",
  description: "Browse SUBFLIX by genre",
};

export const dynamic = "force-dynamic";

export default async function GenresPage() {
  let genreList: Awaited<ReturnType<typeof getAllGenres>> = [];
  let error: string | null = null;

  try {
    genreList = await getAllGenres();
  } catch (e) {
    console.error("[genres page]", e);
    error = "Unable to load genres right now.";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Genres
        </h1>
        <p className="mt-2 text-muted">Browse content by genre</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center text-red-300">
          {error}
        </div>
      ) : genreList.length === 0 ? (
        <EmptyState
          variant="genre"
          title="No genres yet"
          description="Genres will appear here once they are added to the catalog."
          actionHref="/"
          actionLabel="Back to Home"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-4">
          {genreList.map((g) => (
            <GenreCard key={g.id} genre={g} />
          ))}
        </div>
      )}
    </div>
  );
}
