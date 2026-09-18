"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmDelete({
  label = "Delete",
  confirmLabel = "Confirm delete",
  onConfirm,
  className,
}: {
  label?: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className={className ?? "text-red-400 hover:text-red-300"}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="text-muted"
        disabled={pending}
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="text-red-400 hover:text-red-300"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            await onConfirm();
            setOpen(false);
          });
        }}
      >
        {pending ? "Deleting…" : confirmLabel}
      </Button>
    </span>
  );
}
