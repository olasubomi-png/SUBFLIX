# SUBFLIX

**Stream. Download. Watch Anywhere.**

A modern, premium streaming platform built with Next.js.

## Phase 1 — Foundation (Current)

This repository currently contains the Phase 1 foundation:

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS with custom SUBFLIX brand theme
- Polished cinematic landing / home page
- Reusable movie, series, genre & continue-watching components
- PostgreSQL + Drizzle ORM schema foundation
- Auth architecture placeholders
- Production-ready project structure

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

### 3. Database (optional for UI only)

```bash
# Generate migrations
npm run db:generate

# Apply migrations (requires running Postgres)
npm run db:migrate
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                 # App Router pages
├── auth/                # Auth foundation (next phase)
├── components/          # UI components
│   ├── ui/              # shadcn-style primitives
│   ├── hero.tsx
│   ├── navbar.tsx
│   ├── movie-card.tsx
│   └── ...
├── data/                # Mock data (Phase 1)
├── db/                  # Drizzle schema & client
└── lib/                 # Utilities
```

## Roadmap Overview

| Phase | Focus                        | Status      |
|-------|------------------------------|-------------|
| 1     | Foundation + Landing         | ✅ Done     |
| 2     | Movies & Series Catalog      | Planned     |
| 3     | Admin CMS                    | Planned     |
| 4     | Video Streaming Engine       | Planned     |
| 5     | Offline Downloads            | Planned     |
| 6     | Subscriptions + Paystack     | Planned     |
| 7+    | Personalization, Mobile, etc.| Future      |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run db:generate` — generate Drizzle migrations
- `npm run db:migrate` — apply migrations
- `npm run db:studio` — open Drizzle Studio

## License

Private — All rights reserved.
