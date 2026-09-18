"use client";

import { useActionState, useTransition } from "react";
import type { ActionResult } from "@/app/actions/admin";
import { addSeriesCastAction, removeSeriesCastAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea, Checkbox, MultiSelect } from "@/components/admin/form-fields";

const initial: ActionResult = {};

export function SeriesEditForm({
  series,
  genres,
  categories,
  people,
  updateAction,
  seriesId,
}: {
  series: {
    title: string;
    slug: string;
    description: string | null;
    releaseYear: number | null;
    ageRating: string | null;
    language: string | null;
    posterUrl: string | null;
    backdropUrl: string | null;
    trailerUrl: string | null;
    rating: number | null;
    isPublished: boolean;
    isFeatured: boolean;
    isTrending: boolean;
    genreIds: string[];
    categoryIds: string[];
    directorIds: string[];
    cast: { id: string; personId: string; characterName: string | null }[];
  };
  genres: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  people: { id: string; name: string }[];
  updateAction: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  seriesId: string;
}) {
  const [state, action, pending] = useActionState(updateAction, initial);
  const peopleMap = Object.fromEntries(people.map((p) => [p.id, p.name]));
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-4 rounded-xl border border-white/10 bg-card p-6">
        {state.error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</div>}
        {state.success && <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">Saved</div>}
        <Field label="Title" name="title" required defaultValue={series.title} />
        <Field label="Slug" name="slug" required defaultValue={series.slug} />
        <TextArea label="Description" name="description" defaultValue={series.description} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Release year" name="releaseYear" type="number" defaultValue={series.releaseYear} />
          <Field label="Age rating" name="ageRating" defaultValue={series.ageRating} />
          <Field label="Language" name="language" defaultValue={series.language ?? "en"} />
          <Field label="Rating" name="rating" type="number" defaultValue={series.rating} />
        </div>
        <Field label="Poster URL" name="posterUrl" defaultValue={series.posterUrl} />
        <Field label="Backdrop URL" name="backdropUrl" defaultValue={series.backdropUrl} />
        <Field label="Trailer URL" name="trailerUrl" defaultValue={series.trailerUrl} />
        <div className="flex flex-wrap gap-4">
          <Checkbox label="Published" name="isPublished" defaultChecked={series.isPublished} />
          <Checkbox label="Featured" name="isFeatured" defaultChecked={series.isFeatured} />
          <Checkbox label="Trending" name="isTrending" defaultChecked={series.isTrending} />
        </div>
        <MultiSelect label="Genres" name="genreIds" options={genres} selectedIds={series.genreIds} />
        <MultiSelect label="Categories" name="categoryIds" options={categories} selectedIds={series.categoryIds} />
        <MultiSelect label="Directors" name="directorIds" options={people} selectedIds={series.directorIds} />
        <Button type="submit" disabled={pending} className="w-full">{pending ? "Saving…" : "Save changes"}</Button>
      </form>

      <section className="space-y-4 rounded-xl border border-white/10 bg-card p-6">
        <h2 className="text-lg font-semibold text-white">Cast</h2>
        <ul className="space-y-2">
          {series.cast.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
              <span className="text-white">
                {peopleMap[c.personId] ?? c.personId}
                {c.characterName ? <span className="text-muted"> as {c.characterName}</span> : null}
              </span>
              <button
                type="button"
                disabled={isPending}
                className="text-xs text-red-400"
                onClick={() => startTransition(async () => { await removeSeriesCastAction(seriesId, c.id); })}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <form action={async (fd) => { await addSeriesCastAction(seriesId, fd); }} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <select name="personId" required className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
            <option value="">Person…</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input name="characterName" placeholder="Character" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <Button type="submit" size="sm">Add</Button>
        </form>
      </section>
    </div>
  );
}
