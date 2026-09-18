"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  deleteMovieAction,
  toggleMovieFlagAction,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/admin/confirm-delete";

export function MovieRowActions({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex justify-end gap-1">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            await toggleMovieFlagAction(id, "isPublished");
          });
        }}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button asChild size="sm" variant="secondary">
        <Link href={`/admin/movies/${id}/edit`}>Edit</Link>
      </Button>
      <ConfirmDelete
        onConfirm={async () => {
          await deleteMovieAction(id);
        }}
      />
    </div>
  );
}
