import Link from "next/link";
import Image from "next/image";
import { listAdminMovies } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import {
  deleteMovieAction,
  toggleMovieFlagAction,
} from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminMoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let moviesList: Awaited<ReturnType<typeof listAdminMovies>> = [];
  try {
    moviesList = await listAdminMovies({ search: q, limit: 100 });
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Movies</h1>
          <p className="text-sm text-muted">{moviesList.length} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/movies/new">Add Movie</Link>
        </Button>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title…"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500"
        />
        <Button type="submit" variant="secondary" size="sm">
          Search
        </Button>
      </form>

      {moviesList.length === 0 ? (
        <p className="py-12 text-center text-muted">No movies yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-white/10 bg-card text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-3">Movie</th>
                <th className="px-3 py-3">Year</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Flags</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {moviesList.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-8 flex-shrink-0 overflow-hidden rounded bg-card-hover">
                        {m.posterUrl ? (
                          <Image src={m.posterUrl} alt="" fill className="object-cover" sizes="32px" />
                        ) : null}
                      </div>
                      <div>
                        <Link
                          href={`/admin/movies/${m.id}/edit`}
                          className="font-medium text-white hover:text-violet-300"
                        >
                          {m.title}
                        </Link>
                        <p className="text-xs text-muted">{m.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted">{m.releaseYear ?? "—"}</td>
                  <td className="px-3 py-3">
                    <span
                      className={
                        m.isPublished
                          ? "rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300"
                          : "rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300"
                      }
                    >
                      {m.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted">
                    {m.isFeatured && "Featured "}
                    {m.isTrending && "Trending"}
                    {!m.isFeatured && !m.isTrending && "—"}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <form
                        action={async () => {
                          "use server";
                          await toggleMovieFlagAction(m.id, "isPublished");
                        }}
                      >
                        <Button type="submit" size="sm" variant="ghost">
                          {m.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                      </form>
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/admin/movies/${m.id}/edit`}>Edit</Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await deleteMovieAction(m.id);
                        }}
                      >
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
