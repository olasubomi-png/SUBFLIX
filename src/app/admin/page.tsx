import Link from "next/link";
import {
  Film,
  Tv,
  Tags,
  FolderOpen,
  Users,
  UserCircle,
  Layers,
  Clapperboard,
} from "lucide-react";
import { getAdminStats } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let stats;
  try {
    stats = await getAdminStats();
  } catch (e) {
    console.error("[admin dashboard]", e);
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
        Unable to load dashboard statistics. Check DATABASE_URL.
      </div>
    );
  }

  const cards = [
    {
      label: "Movies",
      value: stats.movies.total,
      sub: `${stats.movies.published} published · ${stats.movies.unpublished} draft`,
      href: "/admin/movies",
      icon: Film,
    },
    {
      label: "Series",
      value: stats.series.total,
      sub: `${stats.series.published} published · ${stats.series.unpublished} draft`,
      href: "/admin/series",
      icon: Tv,
    },
    { label: "Seasons", value: stats.seasons, href: "/admin/series", icon: Layers },
    {
      label: "Episodes",
      value: stats.episodes,
      href: "/admin/series",
      icon: Clapperboard,
    },
    { label: "Genres", value: stats.genres, href: "/admin/genres", icon: Tags },
    {
      label: "Categories",
      value: stats.categories,
      href: "/admin/categories",
      icon: FolderOpen,
    },
    { label: "People", value: stats.people, href: "/admin/people", icon: UserCircle },
    { label: "Users", value: stats.users, href: "/admin/users", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Manage the SUBFLIX catalog and users
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-white/10 bg-card p-4 transition-colors hover:border-violet-500/40 hover:bg-card-hover"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-violet-400" />
                <span className="text-2xl font-bold text-white">{card.value}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-300">{card.label}</p>
              {"sub" in card && card.sub && (
                <p className="mt-0.5 text-xs text-muted">{card.sub}</p>
              )}
            </Link>
          );
        })}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/admin/movies/new">Add Movie</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/admin/series/new">Add Series</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/admin/genres">Manage Genres</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/admin/categories">Manage Categories</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/admin/people">Manage People</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/admin/users">Manage Users</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
