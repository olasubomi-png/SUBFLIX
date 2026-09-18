import type { Metadata } from "next";
import { getPublishedSeries } from "@/lib/catalog";
import { CatalogGrid } from "@/components/catalog-grid";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "Series | SUBFLIX",
  description: "Browse the SUBFLIX series catalog",
};

export const dynamic = "force-dynamic";

export default async function SeriesPage() {
  let seriesList: Awaited<ReturnType<typeof getPublishedSeries>> = [];
  let error: string | null = null;

  try {
    seriesList = await getPublishedSeries({ limit: 100 });
  } catch (e) {
    console.error("[series page]", e);
    error = "Unable to load series right now.";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Series
        </h1>
        <p className="mt-2 text-muted">
          Discover series available on SUBFLIX
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center text-red-300">
          {error}
        </div>
      ) : seriesList.length === 0 ? (
        <EmptyState variant="series" actionHref="/" actionLabel="Back to Home" />
      ) : (
        <CatalogGrid series={seriesList} />
      )}
    </div>
  );
}
