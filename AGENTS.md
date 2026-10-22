<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# The Sports Digest — Project Guide

Production site: **https://thesportsdigest.com** · Repo: `sly-edmonds/The-Sports-Digest` · Deployed on Vercel.

Next.js **16.2.6** (Turbopack), React 19.2.4, TypeScript 5, Tailwind v4. Node 24.

## Windows shell rules (important)

PowerShell on this machine blocks `.ps1` scripts, so plain `npm` / `npx` fail with
"running scripts is disabled on this system".

- Use **`npm.cmd`** and **`npx.cmd`** (e.g. `npm.cmd run build`, `npx.cmd tsc --noEmit`).
- `opencode.cmd` is the CLI entrypoint for the same reason.
- `next build` takes a lock in `.next/` — if you see "Another next build process is
  already running", wait for the prior build to exit rather than killing the lock.

## Commands

```bash
npm.cmd run dev     # dev server on :3000
npm.cmd run build   # typecheck + production build (also the typecheck command)
npm.cmd run start   # serve the production build
```

`npm.cmd run build` runs TypeScript, so it is the canonical "does it compile" check.
There is no separate lint script.

## Architecture

The site is a **client-rendered single page** with in-memory view state, not URL routing.

- `app/page.tsx` — the shell. Holds a `page` union type (`"home" | "about" | "ghana-sports" | ...`)
  and renders one component per view. Navigation is `setPage`, not `<Link>`.
  Only `/` and `/editorial` are real routes.
- `app/components/` — one file per view. Large ones: `BlackStars.tsx` (~967 lines),
  `DivisionOneLeague.tsx` (~885), `GhanaSportsNews.tsx` (~804), `BlackQueens.tsx` (~743),
  `SportsMenuScreens.tsx` (~678), `GhanaPremierLeague.tsx` (~592), `SportsPage.tsx` (~583).
- `app/components/lib/` — shared logic:
  - `data.ts` — static site copy + the `SEO` metadata map keyed by page.
  - `ghanaSportsData.ts` — types (`GhanaSportArticle`, `SportCategory`), seed articles,
    `GHANA_SPORTS_CATEGORIES`, `SPORT_PRESET_IMAGES`.
  - `ghanaFeedRegistry.ts` — **the source registry.** Every monitored feed, its
    trust tier (`federation` / `national_media` / `wire_aggregator`) and the
    disciplines it covers. `getCoverageMatrix()` proves all 8 disciplines are
    covered. Add or retire feeds here, never inline in the engine.
  - `ghanaNewsStore.ts` — singleton `GhanaNewsStore`; persists to
    `data/ghana-sports-news.json` on disk via temp-file + rename. Dedupes by id,
    headline **and** source URL. Caps the pending queue at `MAX_PENDING_QUEUE`.
  - `automatedIngestionEngine.ts` — RSS/Atom scraping, word-boundary sport
    classification, freshness window, cross-source dedupe, og:image extraction,
    per-source health telemetry.
  - `editorialAuth.ts` — server-side check for the newsroom passkey
    (`x-editorial-token` header).
  - `hooks.ts` — `useSEO` (rewrites document title/description).
- `app/styles/` — plain CSS files imported from `app/layout.tsx` alongside Tailwind.
  Component-specific CSS lives next to the components that use it.
- `app/editorial/page.tsx` — the newsroom. Passkey gate → verification queue →
  approve/reject/edit → publish live → optional Resend breaking alert.
  Also hosts **manual story filing** and the **source health / coverage panel**.

### API routes

| Route | Purpose |
| --- | --- |
| `GET /api/ghana-sports-news` | List articles by `?status=` and `?category=`. Public callers only ever get `approved`; any other status requires the editorial token. |
| `POST /api/ghana-sports-news` | Actions: `approve`, `update`, `reject`, `reset`, `ingest_wire`, `submit_story`, `check_feeds`. All require the editorial token. |
| `GET|POST /api/cron/ingest` | Runs the wire crawler. Vercel cron calls this every 30 min with `CRON_SECRET`. |
| `GET /api/matches` | Live fixtures via football-data.org. |
| `GET /api/insights` | Editorial insight feed. |
| `POST /api/contact` | Contact form. |
| `POST /api/upload` | Editorial image upload → `public/uploads/`. Requires the editorial token. |
| `POST /api/newsletter/breaking-alert` | Sends the breaking bulletin via Resend. Requires the editorial token — it reaches subscribers, so it counts as a publish action. |

### Editorial publishing model

Every discovered story lands as `status: "pending"`. **Nothing goes live without
approval.** Approval flips `status` to `"approved"`, stamps `publishedAt`, and writes
an `editorialVerification` audit trail (`verifiedBy`, `verifiedAt`, `factChecked`,
`sourceVerified`, `editorialNotes`). Rejected stories are deleted from the store.

Two enforcement layers sit on top of the UI:

1. **Server-side** — every mutating action requires the `x-editorial-token`
   header to match `EDITORIAL_PASSKEY` (fallback `digest2026` / `admin`), and the
   public `GET` refuses to serve anything other than `approved` stories. The public
   `GhanaSportsNews` view is read-only: no visitor can file, approve or reject.
   The guard also covers `POST /api/upload` and
   `POST /api/newsletter/breaking-alert`, because both reach the live site —
   one writes into `public/`, the other mails subscribers.
2. **Client-side** — `app/editorial/page.tsx` gates on the passkey. This is a
   speed bump, not a security control: the key still ships in the client bundle.

### Collection model (hybrid)

- **Automated** — `runAutomatedIngestion()` walks `GHANA_FEED_REGISTRY`, fetches
  in parallel (4 at a time, 10s timeout), drops items older than
  `INGEST_MAX_AGE_HOURS` (default 96h), classifies by discipline, strips the
  trailing " - Publisher" suffix and files everything as `pending`.
- **Editorial** — the newsroom's "✍️ File Story" panel files a correspondent,
  federation dispatch or press release into the same queue via `submit_story`.
- Google News queries use the `when:7d` operator. Without it Google returns
  relevance-ranked results that are months old and the freshness filter discards
  nearly all of them.

### Source registry

Verified live 2026-10-22. Sources that returned HTML, 403/404 or failed DNS
(graphic.com.gh `?type=rss`, citinewsroom, modernghana, ghanaweb, gna.org.gh,
ghanaboxing.org, ghanavolley.org, ghanahockey.org, armwrestlingghana.com) were
excluded rather than left in place to fail silently on every cron run.

| id | publisher | tier |
| --- | --- | --- |
| `gfa-official` | Ghana Football Association | federation |
| `ghanasoccernet` | GhanaSoccernet | national_media |
| `ghana-sports-news` | GHSportsNews | national_media |
| `myjoy-sports` | MyJoyOnline Sports | national_media |
| `gnews-*` (8) | Google News wire, one query per discipline | wire_aggregator |

## Conventions

- Match the surrounding file's style. Tailwind utility classes in JSX, plain CSS
  for the larger component stylesheets.
- Images live in `public/` under topic folders (`Ghana-Premier-League-Clubs/`,
  `Black-Stars-Graphics/`, `Ghana-Division-One-Teams/`, etc.).
- Never commit `.env*` — it is gitignored. Keys in use: `API_FOOTBALL`,
  `OPENAI_API_KEY`, `NEXT_PUBLIC_API_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL`,
  `EDITORIAL_PASSKEY`, `CRON_SECRET`, `INGEST_MAX_AGE_HOURS`. See `.env.example`.
- `data/ghana-sports-news.json` is the live newsroom database and is tracked in git.
  It changes on every approve/reject/ingest, so expect it in diffs.
- On Vercel the project directory is read-only, so the store falls back to the OS
  temp directory (ephemeral). `counts.persistentStorage` reports
  `writable` / `ephemeral` so the newsroom can warn about it.
- TypeScript is strict. Keep component props typed.
- Do not edit files with PowerShell `Get-Content` / `Set-Content`: the default
  ANSI codepage corrupts UTF-8 (em dashes, smart quotes, emoji). Use the editor.

## Deployment

Vercel, with `vercel.json` defining the `/api/cron/ingest` cron at `*/30 * * * *`.
Set `CRON_SECRET` and `EDITORIAL_PASSKEY` in the Vercel project, otherwise the
cron endpoint rejects the scheduled request.
Pushing to `master` deploys to production.
