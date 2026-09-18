"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  deleteSeriesAction,
  toggleSeriesFlagAction,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/admin/confirm-delete";

export function SeriesRowActions({
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
            await toggleSeriesFlagAction(id, "isPublished");
          });
        }}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button asChild size="sm" variant="secondary">
        <Link href={`/admin/series/${id}/seasons`}>Seasons</Link>
      </Button>
      <Button asChild size="sm" variant="secondary">
        <Link href={`/admin/series/${id}/edit`}>Edit</Link>
      </Button>
      <ConfirmDelete
        onConfirm={async () => {
          await deleteSeriesAction(id);
        }}
      />
    </div>
  );
}
