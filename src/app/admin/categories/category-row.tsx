"use client";

import { useState, useTransition } from "react";
import { updateCategoryAction, deleteCategoryAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/form-fields";
import { ConfirmDelete } from "@/components/admin/confirm-delete";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-card px-4 py-3">
        <div>
          <p className="font-medium text-white">{category.name}</p>
          <p className="text-xs text-muted">{category.slug}</p>
          {category.description && (
            <p className="mt-1 line-clamp-1 text-xs text-muted">{category.description}</p>
          )}
        </div>
        <div className="flex gap-1">
          <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <ConfirmDelete onConfirm={async () => { await deleteCategoryAction(category.id); }} />
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-violet-500/30 bg-card p-4">
      <form
        action={(fd) => {
          startTransition(async () => {
            const res = await updateCategoryAction(category.id, {}, fd);
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
        <Field label="Name" name="name" required defaultValue={category.name} />
        <Field label="Slug" name="slug" required defaultValue={category.slug} />
        <TextArea label="Description" name="description" defaultValue={category.description} rows={2} />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      </form>
    </li>
  );
}
