# SUBFLIX

**Stream. Download. Watch Anywhere.**

A modern, premium streaming platform built with Next.js.

## Phase 1 — Foundation + Authentication ✅

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS with custom SUBFLIX brand theme
- Polished cinematic landing / home page
- Reusable movie, series, genre & continue-watching components
- PostgreSQL + Drizzle ORM schema foundation
- **Full session-based authentication** (register, login, logout)
- Secure password hashing (bcrypt)
- Database-backed sessions (HTTP-only cookies)
- Role support (user / admin)
- Default user profile on registration
- Production-ready project structure

## Phase 2 — Catalog + Admin CMS (In Progress)

Schema enhancements completed:
- `sessions` table
- `video_url`, `is_featured`, `is_trending` on movies/series
- Unique constraints on season/episode numbers
- Migration: `0001_phase1_auth_and_catalog_fields`

## Brand

- **Midnight Navy**: `#080A1A`
- **Electric Violet**: `#7C3AED`
- **Bright Purple**: `#A855F7`
- **Cool Gray**: `#A1A1AA`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set at least:

```
DATABASE_URL=postgresql://user:password@localhost:5432/subflix
```

### 3. Database

```bash
npm run db:generate   # if needed
npm run db:migrate
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run db:generate` — generate Drizzle migrations
- `npm run db:migrate` — apply migrations
- `npm run db:studio` — open Drizzle Studio

## License

Private — All rights reserved.
