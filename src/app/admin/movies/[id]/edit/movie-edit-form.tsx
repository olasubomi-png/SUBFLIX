"use client";

import { useActionState, useTransition } from "react";
import type { ActionResult } from "@/app/actions/admin";
import {
  addMovieCastAction,
  removeMovieCastAction,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Field,
  TextArea,
  Checkbox,
  MultiSelect,
} from "@/components/admin/form-fields";

const initial: ActionResult = {};

type Movie = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  releaseYear: number | null;
  runtime: number | null;
  ageRating: string | null;
  language: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  videoUrl: string | null;
  rating: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  genreIds: string[];
  categoryIds: string[];
  directorIds: string[];
  cast: {
    id: string;
    personId: string;
    characterName: string | null;
    castOrder: number;
  }[];
};

export function MovieEditForm({
  movie,
  genres,
  categories,
  people,
  updateAction,
  movieId,
}: {
  movie: Movie;
  genres: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  people: { id: string; name: string }[];
  updateAction: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  movieId: string;
}) {
  const [state, action, pending] = useActionState(updateAction, initial);
  const peopleMap = Object.fromEntries(people.map((p) => [p.id, p.name]));
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-4 rounded-xl border border-white/10 bg-card p-6">
        {state.error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            Saved
          </div>
        )}
        <Field label="Title" name="title" required defaultValue={movie.title} />
        <Field label="Slug" name="slug" required defaultValue={movie.slug} />
        <TextArea label="Description" name="description" defaultValue={movie.description} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Release year" name="releaseYear" type="number" defaultValue={movie.releaseYear} />
          <Field label="Runtime (min)" name="runtime" type="number" defaultValue={movie.runtime} />
          <Field label="Age rating" name="ageRating" defaultValue={movie.ageRating} />
          <Field label="Language" name="language" defaultValue={movie.language ?? "en"} />
          <Field label="Rating" name="rating" type="number" defaultValue={movie.rating} />
        </div>
        <Field label="Poster URL" name="posterUrl" defaultValue={movie.posterUrl} />
        <Field label="Backdrop URL" name="backdropUrl" defaultValue={movie.backdropUrl} />
        <Field label="Trailer URL" name="trailerUrl" defaultValue={movie.trailerUrl} />
        <Field label="Video URL" name="videoUrl" defaultValue={movie.videoUrl} />
        <div className="flex flex-wrap gap-4">
          <Checkbox label="Published" name="isPublished" defaultChecked={movie.isPublished} />
          <Checkbox label="Featured" name="isFeatured" defaultChecked={movie.isFeatured} />
          <Checkbox label="Trending" name="isTrending" defaultChecked={movie.isTrending} />
        </div>
        <MultiSelect label="Genres" name="genreIds" options={genres} selectedIds={movie.genreIds} />
        <MultiSelect label="Categories" name="categoryIds" options={categories} selectedIds={movie.categoryIds} />
        <MultiSelect label="Directors" name="directorIds" options={people} selectedIds={movie.directorIds} />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </form>

      <section className="space-y-4 rounded-xl border border-white/10 bg-card p-6">
        <h2 className="text-lg font-semibold text-white">Cast</h2>
        <ul className="space-y-2">
          {movie.cast.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
            >
              <span className="text-white">
                {peopleMap[c.personId] ?? c.personId}
                {c.characterName ? (
                  <span className="text-muted"> as {c.characterName}</span>
                ) : null}
              </span>
              <button
                type="button"
                disabled={isPending}
                className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                onClick={() => {
                  startTransition(async () => {
                    await removeMovieCastAction(movieId, c.id);
                  });
                }}
              >
                Remove
              </button>
            </li>
          ))}
          {movie.cast.length === 0 && (
            <p className="text-sm text-muted">No cast assigned</p>
          )}
        </ul>
        <form
          action={async (fd) => {
            await addMovieCastAction(movieId, fd);
          }}
          className="flex flex-col gap-2 sm:flex-row sm:items-end"
        >
          <div className="flex-1 space-y-1">
            <label className="text-xs text-muted">Person</label>
            <select
              name="personId"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            >
              <option value="">Select…</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs text-muted">Character</label>
            <input
              name="characterName"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="w-20 space-y-1">
            <label className="text-xs text-muted">Order</label>
            <input
              name="castOrder"
              type="number"
              defaultValue={0}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </div>
          <Button type="submit" size="sm">
            Add
          </Button>
        </form>
      </section>
    </div>
  );
}
