"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Tv,
  Tags,
  FolderOpen,
  Users,
  UserCircle,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/movies", label: "Movies", icon: Film },
  { href: "/admin/series", label: "Series", icon: Tv },
  { href: "/admin/genres", label: "Genres", icon: Tags },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/people", label: "People", icon: UserCircle },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-violet-600/20 text-violet-300"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-white/5 bg-card/50 lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/5 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-black text-white">
            S
          </div>
          <div>
            <p className="text-sm font-bold text-white">SUBFLIX</p>
            <p className="text-[10px] uppercase tracking-wider text-violet-400">
              Admin
            </p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <NavLinks />
        </nav>
        <div className="space-y-2 border-t border-white/5 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </Link>
          <p className="truncate px-3 text-xs text-muted">{userEmail}</p>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
              Log out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between border-b border-white/5 bg-card/80 px-4 lg:hidden">
        <span className="font-bold text-white">SUBFLIX Admin</span>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-white hover:bg-white/10"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-b border-white/5 bg-card p-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            <NavLinks onClick={() => setOpen(false)} />
          </nav>
          <form action={logoutAction} className="mt-3">
            <Button type="submit" variant="secondary" size="sm" className="w-full">
              Log out
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
