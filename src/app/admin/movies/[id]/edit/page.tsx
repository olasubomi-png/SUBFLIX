import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminMovieById,
  listAdminGenres,
  listAdminCategories,
  listAdminPeople,
} from "@/lib/admin-data";
import { updateMovieAction } from "@/app/actions/admin";
import { MovieEditForm } from "./movie-edit-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditMoviePage({ params }: Props) {
  const { id } = await params;
  let movie;
  try {
    movie = await getAdminMovieById(id);
  } catch {
    notFound();
  }
  if (!movie) notFound();

  const [genres, categories, peopleList] = await Promise.all([
    listAdminGenres(),
    listAdminCategories(),
    listAdminPeople(),
  ]);

  const update = updateMovieAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Edit Movie</h1>
        <div className="flex gap-2">
          <ButtonLink href={`/movies/${movie.slug}`} label="View public" />
          <ButtonLink href="/admin/movies" label="Back" />
        </div>
      </div>
      <MovieEditForm
        movie={movie}
        genres={genres}
        categories={categories}
        people={peopleList}
        updateAction={update}
        movieId={id}
      />
    </div>
  );
}

function ButtonLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-white/5 hover:text-white"
    >
      {label}
    </Link>
  );
}
