import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminSeriesById,
  getSeasonById,
  listAdminEpisodes,
} from "@/lib/admin-data";
import { createEpisodeAction, deleteEpisodeAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea, Checkbox } from "@/components/admin/form-fields";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string; seasonId: string }> };

export default async function AdminEpisodesPage({ params }: Props) {
  const { id, seasonId } = await params;
  const seriesItem = await getAdminSeriesById(id).catch(() => null);
  if (!seriesItem) notFound();
  const season = await getSeasonById(seasonId);
  if (!season || season.seriesId !== id) notFound();
  const eps = await listAdminEpisodes(seasonId);
  const create = createEpisodeAction.bind(null, id, seasonId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Episodes — S{season.seasonNumber} · {seriesItem.title}
          </h1>
          <p className="text-sm text-muted">{eps.length} episodes</p>
        </div>
        <Link href={`/admin/series/${id}/seasons`} className="text-sm text-muted hover:text-white">
          Back to seasons
        </Link>
      </div>

      <ul className="space-y-2">
        {eps.map((e) => (
          <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-card px-4 py-3">
            <div>
              <p className="font-medium text-white">
                E{e.episodeNumber}. {e.title}
              </p>
              <p className="text-xs text-muted">
                {e.runtime ? `${e.runtime} min · ` : ""}
                {e.isPublished ? "Published" : "Draft"}
              </p>
            </div>
            <form action={async () => { "use server"; await deleteEpisodeAction(id, seasonId, e.id); }}>
              <Button type="submit" size="sm" variant="ghost" className="text-red-400">Delete</Button>
            </form>
          </li>
        ))}
        {eps.length === 0 && <p className="text-muted">No episodes yet.</p>}
      </ul>

      <form action={create} className="space-y-3 rounded-xl border border-white/10 bg-card p-6">
        <h2 className="font-semibold text-white">Add episode</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Episode number" name="episodeNumber" type="number" required />
          <Field label="Title" name="title" required />
          <Field label="Runtime (min)" name="runtime" type="number" />
          <Field label="Thumbnail URL" name="thumbnailUrl" />
          <Field label="Video URL" name="videoUrl" className="sm:col-span-2" />
        </div>
        <TextArea label="Description" name="description" rows={2} />
        <Checkbox label="Published" name="isPublished" />
        <Button type="submit" size="sm">Create episode</Button>
      </form>
    </div>
  );
}
