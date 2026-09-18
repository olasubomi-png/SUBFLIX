"use client";

import { useState, useTransition } from "react";
import { updatePersonAction, deletePersonAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/form-fields";
import { ConfirmDelete } from "@/components/admin/confirm-delete";

type Person = {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
  biography: string | null;
};

export function PersonRow({ person }: { person: Person }) {
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-card px-4 py-3">
        <div className="min-w-0">
          <p className="font-medium text-white">{person.name}</p>
          <p className="text-xs text-muted">{person.slug}</p>
          {person.biography && (
            <p className="mt-1 line-clamp-1 text-xs text-muted">{person.biography}</p>
          )}
        </div>
        <div className="flex gap-1">
          <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <ConfirmDelete onConfirm={async () => { await deletePersonAction(person.id); }} />
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-violet-500/30 bg-card p-4">
      <form
        action={(fd) => {
          startTransition(async () => {
            const res = await updatePersonAction(person.id, {}, fd);
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
          <p className={`text-sm ${msg === "Saved" ? "text-emerald-300" : "text-red-300"}`}>{msg}</p>
        )}
        <Field label="Name" name="name" required defaultValue={person.name} />
        <Field label="Slug" name="slug" required defaultValue={person.slug} />
        <Field label="Photo URL" name="photoUrl" defaultValue={person.photoUrl} />
        <TextArea label="Biography" name="biography" defaultValue={person.biography} rows={3} />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      </form>
    </li>
  );
}
