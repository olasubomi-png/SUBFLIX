import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/catalog";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "Categories | SUBFLIX",
  description: "Browse SUBFLIX by category",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let list: Awaited<ReturnType<typeof getAllCategories>> = [];
  let error: string | null = null;

  try {
    list = await getAllCategories();
  } catch (e) {
    console.error("[categories]", e);
    error = "Unable to load categories right now.";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Categories
        </h1>
        <p className="mt-2 text-muted">Browse content by category</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center text-red-300">
          {error}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          variant="generic"
          title="No categories yet"
          description="Categories will appear here once they are added to the catalog."
          actionHref="/"
          actionLabel="Back to Home"
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group rounded-xl border border-white/10 bg-card p-5 transition-all hover:border-violet-500/40 hover:bg-card-hover hover:shadow-lg hover:shadow-violet-900/20"
            >
              <h2 className="text-lg font-semibold text-white group-hover:text-violet-300">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {cat.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
