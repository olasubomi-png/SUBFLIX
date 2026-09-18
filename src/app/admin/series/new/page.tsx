"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createSeriesAction, type ActionResult } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea, Checkbox } from "@/components/admin/form-fields";

const initial: ActionResult = {};

export default function NewSeriesPage() {
  const [state, action, pending] = useActionState(createSeriesAction, initial);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">New Series</h1>
        <Button asChild variant="ghost" size="sm"><Link href="/admin/series">Back</Link></Button>
      </div>
      <form action={action} className="space-y-4 rounded-xl border border-white/10 bg-card p-6">
        {state.error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</div>}
        <Field label="Title" name="title" required />
        <Field label="Slug (optional)" name="slug" />
        <TextArea label="Description" name="description" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Release year" name="releaseYear" type="number" />
          <Field label="Age rating" name="ageRating" />
          <Field label="Language" name="language" defaultValue="en" />
          <Field label="Rating" name="rating" type="number" />
        </div>
        <Field label="Poster URL" name="posterUrl" />
        <Field label="Backdrop URL" name="backdropUrl" />
        <Field label="Trailer URL" name="trailerUrl" />
        <div className="flex flex-wrap gap-4">
          <Checkbox label="Published" name="isPublished" />
          <Checkbox label="Featured" name="isFeatured" />
          <Checkbox label="Trending" name="isTrending" />
        </div>
        <Button type="submit" disabled={pending} className="w-full">{pending ? "Creating…" : "Create Series"}</Button>
      </form>
    </div>
  );
}
