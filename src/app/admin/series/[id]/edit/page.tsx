import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminSeriesById,
  listAdminGenres,
  listAdminCategories,
  listAdminPeople,
} from "@/lib/admin-data";
import { updateSeriesAction } from "@/app/actions/admin";
import { SeriesEditForm } from "./series-edit-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditSeriesPage({ params }: Props) {
  const { id } = await params;
  const item = await getAdminSeriesById(id).catch(() => null);
  if (!item) notFound();
  const [genres, categories, peopleList] = await Promise.all([
    listAdminGenres(),
    listAdminCategories(),
    listAdminPeople(),
  ]);
  const update = updateSeriesAction.bind(null, id);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-white">Edit Series</h1>
        <div className="flex gap-2 text-sm">
          <Link href={`/admin/series/${id}/seasons`} className="text-violet-400 hover:text-violet-300">Seasons</Link>
          <Link href="/admin/series" className="text-muted hover:text-white">Back</Link>
        </div>
      </div>
      <SeriesEditForm
        series={item}
        genres={genres}
        categories={categories}
        people={peopleList}
        updateAction={update}
        seriesId={id}
      />
    </div>
  );
}
