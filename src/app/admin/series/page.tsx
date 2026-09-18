import Link from "next/link";
import Image from "next/image";
import { listAdminSeries } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { SeriesRowActions } from "./series-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminSeriesPage() {
  let list: Awaited<ReturnType<typeof listAdminSeries>> = [];
  try {
    list = await listAdminSeries({ limit: 100 });
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Series</h1>
          <p className="text-sm text-muted">{list.length} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/series/new">Add Series</Link>
        </Button>
      </div>

      {list.length === 0 ? (
        <p className="py-12 text-center text-muted">No series yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-white/10 bg-card text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-3">Series</th>
                <th className="px-3 py-3">Year</th>
                <th className="px-3 py-3">Seasons</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-8 flex-shrink-0 overflow-hidden rounded bg-card-hover">
                        {s.posterUrl ? (
                          <Image src={s.posterUrl} alt="" fill className="object-cover" sizes="32px" />
                        ) : null}
                      </div>
                      <Link href={`/admin/series/${s.id}/edit`} className="font-medium text-white hover:text-violet-300">
                        {s.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted">{s.releaseYear ?? "—"}</td>
                  <td className="px-3 py-3 text-muted">{s.seasonsCount}</td>
                  <td className="px-3 py-3">
                    <span className={s.isPublished ? "rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300" : "rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300"}>
                      {s.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <SeriesRowActions id={s.id} isPublished={s.isPublished} />
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
