"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "Series" },
  { href: "/genres", label: "Genres" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-900/30">
              <span className="text-lg font-black text-white">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">SUB</span>
              <span className="text-gray-400 group-hover:text-violet-300 transition-colors">
                FLIX
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="icon" aria-label="Search" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "absolute left-0 right-0 top-16 border-b border-white/5 bg-midnight/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          mobileOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-white/10" />
          <Link
            href="/search"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/5"
          >
            <Search className="h-5 w-5" />
            Search
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-200 hover:bg-white/5"
          >
            <User className="h-5 w-5" />
            Login
          </Link>
          <div className="px-4 pt-2">
            <Button asChild className="w-full">
              <Link href="/signup" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
