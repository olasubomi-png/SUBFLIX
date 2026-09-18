"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search movies, series…"
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          autoComplete="off"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}
