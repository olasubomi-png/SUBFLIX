"use client";

import { useState, useTransition } from "react";
import {
  updateEpisodeAction,
  deleteEpisodeAction,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea, Checkbox } from "@/components/admin/form-fields";
import { ConfirmDelete } from "@/components/admin/confirm-delete";

type Episode = {
  id: string;
  episodeNumber: number;
  title: string;
  description: string | null;
  runtime: number | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  isPublished: boolean;
};

export function EpisodeRow({
  seriesId,
  seasonId,
  episode,
}: {
  seriesId: string;
  seasonId: string;
  episode: Episode;
}) {
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-card px-4 py-3">
        <div>
          <p className="font-medium text-white">
            E{episode.episodeNumber}. {episode.title}
          </p>
          <p className="text-xs text-muted">
            {episode.runtime ? `${episode.runtime} min · ` : ""}
            {episode.isPublished ? "Published" : "Draft"}
          </p>
        </div>
        <div className="flex gap-1">
          <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <ConfirmDelete
            onConfirm={async () => {
              await deleteEpisodeAction(seriesId, seasonId, episode.id);
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
            const res = await updateEpisodeAction(
              seriesId,
              seasonId,
              episode.id,
              {},
              fd
            );
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
            label="Episode number"
            name="episodeNumber"
            type="number"
            required
            defaultValue={episode.episodeNumber}
          />
          <Field label="Title" name="title" required defaultValue={episode.title} />
          <Field label="Runtime (min)" name="runtime" type="number" defaultValue={episode.runtime} />
          <Field label="Thumbnail URL" name="thumbnailUrl" defaultValue={episode.thumbnailUrl} />
          <Field label="Video URL" name="videoUrl" defaultValue={episode.videoUrl} className="sm:col-span-2" />
        </div>
        <TextArea label="Description" name="description" defaultValue={episode.description} rows={2} />
        <Checkbox label="Published" name="isPublished" defaultChecked={episode.isPublished} />
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
