"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  updateSeasonAction,
  deleteSeasonAction,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/form-fields";
import { ConfirmDelete } from "@/components/admin/confirm-delete";

type Season = {
  id: string;
  seasonNumber: number;
  title: string | null;
  description: string | null;
  posterUrl: string | null;
  episodesCount: number;
};

export function SeasonRow({
  seriesId,
  season,
}: {
  seriesId: string;
  season: Season;
}) {
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-card px-4 py-3">
        <div>
          <p className="font-medium text-white">
            Season {season.seasonNumber}
            {season.title ? ` — ${season.title}` : ""}
          </p>
          <p className="text-xs text-muted">{season.episodesCount} episodes</p>
        </div>
        <div className="flex gap-1">
          <Button asChild size="sm" variant="secondary">
            <Link href={`/admin/series/${seriesId}/seasons/${season.id}/episodes`}>
              Episodes
            </Link>
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <ConfirmDelete
            onConfirm={async () => {
              await deleteSeasonAction(seriesId, season.id);
            }}
          />
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-violet-500/30 bg-card p-4">
      <form
        action={(fd) => {
          startTransition(async () => {
            const res = await updateSeasonAction(seriesId, season.id, {}, fd);
            if (res.error) setMsg(res.error);
            else {
              setMsg("Saved");
              setEditing(false);
            }
          });
        }}
        className="space-y-3"
      >
        {msg && (
          <p className={`text-sm ${msg === "Saved" ? "text-emerald-300" : "text-red-300"}`}>
            {msg}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Season number"
            name="seasonNumber"
            type="number"
            required
            defaultValue={season.seasonNumber}
          />
          <Field label="Title" name="title" defaultValue={season.title} />
        </div>
        <TextArea label="Description" name="description" defaultValue={season.description} rows={2} />
        <Field label="Poster URL" name="posterUrl" defaultValue={season.posterUrl} />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </li>
  );
}
