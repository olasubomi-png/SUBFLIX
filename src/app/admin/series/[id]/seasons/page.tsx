import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSeriesById, listAdminSeasons } from "@/lib/admin-data";
import { createSeasonAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/form-fields";
import { SeasonRow } from "./season-row";

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
        <Link href={`/admin/series/${id}/edit`} className="text-sm text-muted hover:text-white">
          Back to series
        </Link>
      </div>

      <ul className="space-y-3">
        {seasonsList.map((s) => (
          <SeasonRow key={s.id} seriesId={id} season={s} />
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
        <Field label="Poster URL" name="posterUrl" />
        <Button type="submit" size="sm">Create season</Button>
      </form>
    </div>
  );
}
