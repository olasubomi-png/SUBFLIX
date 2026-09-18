"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createMovieAction, type ActionResult } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea, Checkbox } from "@/components/admin/form-fields";

const initial: ActionResult = {};

export default function NewMoviePage() {
  const [state, action, pending] = useActionState(createMovieAction, initial);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">New Movie</h1>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/movies">Back</Link>
        </Button>
      </div>

      <form action={action} className="space-y-4 rounded-xl border border-white/10 bg-card p-6">
        {state.error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {state.error}
          </div>
        )}
        <Field label="Title" name="title" required />
        <Field label="Slug (optional)" name="slug" placeholder="auto from title" />
        <TextArea label="Description" name="description" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Release year" name="releaseYear" type="number" />
          <Field label="Runtime (min)" name="runtime" type="number" />
          <Field label="Age rating" name="ageRating" placeholder="PG-13" />
          <Field label="Language" name="language" defaultValue="en" />
          <Field label="Rating 0-10" name="rating" type="number" />
        </div>
        <Field label="Poster URL" name="posterUrl" type="url" />
        <Field label="Backdrop URL" name="backdropUrl" type="url" />
        <Field label="Trailer URL" name="trailerUrl" type="url" />
        <Field label="Video URL" name="videoUrl" type="url" />
        <div className="flex flex-wrap gap-4">
          <Checkbox label="Published" name="isPublished" />
          <Checkbox label="Featured" name="isFeatured" />
          <Checkbox label="Trending" name="isTrending" />
        </div>
        <p className="text-xs text-muted">
          Assign genres, categories, cast, and directors after creating (on the edit page).
        </p>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Creating…" : "Create Movie"}
        </Button>
      </form>
    </div>
  );
}
