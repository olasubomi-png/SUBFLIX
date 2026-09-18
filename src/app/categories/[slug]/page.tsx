import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getMoviesByCategorySlug,
  getSeriesByCategorySlug,
} from "@/lib/catalog";
import { CatalogGrid } from "@/components/catalog-grid";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cat = await getCategoryBySlug(slug);
    if (!cat) return { title: "Category Not Found | SUBFLIX" };
    return {
      title: `${cat.name} | SUBFLIX`,
      description: cat.description ?? `Browse ${cat.name} on SUBFLIX`,
    };
  } catch {
    return { title: "Category | SUBFLIX" };
  }
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;

  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }
  if (!category) notFound();

  let movies: Awaited<ReturnType<typeof getMoviesByCategorySlug>> = [];
  let seriesList: Awaited<ReturnType<typeof getSeriesByCategorySlug>> = [];
  try {
    [movies, seriesList] = await Promise.all([
      getMoviesByCategorySlug(slug, 50),
      getSeriesByCategorySlug(slug, 50),
    ]);
  } catch (e) {
    console.error("[category detail]", e);
  }

  const isEmpty = movies.length === 0 && seriesList.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-muted">{category.description}</p>
        )}
      </div>

      {isEmpty ? (
        <EmptyState
          variant="generic"
          title="Nothing in this category"
          description="No published movies or series are in this category yet."
          actionHref="/categories"
          actionLabel="All Categories"
        />
      ) : (
        <div className="space-y-12">
          {movies.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">Movies</h2>
              <CatalogGrid movies={movies} />
            </section>
          )}
          {seriesList.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">Series</h2>
              <CatalogGrid series={seriesList} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
