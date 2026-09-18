import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSeriesById, listAdminSeasons } from "@/lib/admin-data";
import { createSeasonAction, deleteSeasonAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/form-fields";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminSeasonsPage({ params }: Props) {
  const { id } = await params;
  const seriesItem = await getAdminSeriesById(id).catch(() => null);
  if (!seriesItem) notFound();
  const seasonsList = await listAdminSeasons(id);
  const create = createSeasonAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Seasons — {seriesItem.title}</h1>
          <p className="text-sm text-muted">{seasonsList.length} seasons</p>
        </div>
        <Link href={`/admin/series/${id}/edit`} className="text-sm text-muted hover:text-white">Back to series</Link>
      </div>

      <ul className="space-y-2">
        {seasonsList.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-card px-4 py-3">
            <div>
              <p className="font-medium text-white">
                Season {s.seasonNumber}
                {s.title ? ` — ${s.title}` : ""}
              </p>
              <p className="text-xs text-muted">{s.episodesCount} episodes</p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link href={`/admin/series/${id}/seasons/${s.id}/episodes`}>Episodes</Link>
              </Button>
              <form action={async () => { "use server"; await deleteSeasonAction(id, s.id); }}>
                <Button type="submit" size="sm" variant="ghost" className="text-red-400">Delete</Button>
              </form>
            </div>
          </li>
        ))}
        {seasonsList.length === 0 && <p className="text-muted">No seasons yet.</p>}
      </ul>

      <form action={create} className="space-y-3 rounded-xl border border-white/10 bg-card p-6">
        <h2 className="font-semibold text-white">Add season</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Season number" name="seasonNumber" type="number" required />
          <Field label="Title" name="title" />
        </div>
        <TextArea label="Description" name="description" rows={2} />
        <Button type="submit" size="sm">Create season</Button>
      </form>
    </div>
  );
}
