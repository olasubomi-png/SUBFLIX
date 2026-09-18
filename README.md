# SUBFLIX

**Stream. Download. Watch Anywhere.**

A modern, premium streaming platform built with Next.js.

## Phase 1 — Foundation + Authentication ✅

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS with custom SUBFLIX brand theme
- PostgreSQL + Drizzle ORM
- Full session-based authentication (register, login, logout)
- Secure password hashing (bcrypt) + database-backed sessions
- Role support (user / admin)

## Phase 2 — Movie & Series Catalog ✅

Database-backed browsable catalog:

- **Movies** `/movies` — published movie grid
- **Series** `/series` — published series grid
- **Movie detail** `/movies/[slug]` — metadata, genres, categories, cast, directors, trailer, related
- **Series detail** `/series/[slug]` — seasons, episodes, cast, directors, categories
- **Genres** `/genres` and `/genres/[slug]`
- **Categories** `/categories` and `/categories/[slug]`
- **Search** `/search` — title, description, and genre name via PostgreSQL
- **People / cast / directors** schema (public display; CMS in Phase 3)
- **Home** — trending, featured, new releases, genres from DB
- Only **published** content is public
- Empty / error / 404 states
- Reusable catalog components and data access layer (`src/lib/catalog.ts`)

### Discovery approach (Phase 2)

- **Trending / Featured**: `is_trending` / `is_featured` flags
- **New Releases**: ordered by `release_year` then `created_at`
- **Related**: same genre(s) as current movie
- **Popular**: deferred to analytics phase (no fake metrics)

## Brand

- **Midnight Navy**: `#080A1A`
- **Electric Violet**: `#7C3AED`
- **Bright Purple**: `#A855F7`
- **Cool Gray**: `#A1A1AA`

## Getting Started

```bash
npm install
cp .env.example .env.local
# set DATABASE_URL
npm run db:migrate
npm run dev
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run db:generate` / `db:migrate` / `db:studio`

## License

Private — All rights reserved.
