# Newsroom Guide — Step-by-Step in VS Code

The Ghana Sports News feature now discovers stories automatically, but **nothing
goes live without editorial approval**. This guide walks through the whole
loop: crawl → review → publish → verify public site.

> **Windows note:** PowerShell on this machine blocks `.ps1` scripts, so always
> use `npm.cmd` and `npx.cmd` (not `npm` / `npx`).

---

## Step 1 — Open the project

1. Launch **VS Code**.
2. `File → Open Folder…`
3. Select `C:\Users\j\Desktop\The sports digest\sports-digest2`
4. Click **Select Folder** and trust the workspace if prompted.

---

## Step 2 — Environment file (already prepared)

Open `.env.local` from the Explorer. It already contains:

```dotenv
API_FOOTBALL = https://v3.football.api-sports.io/
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_API_KEY=your_api_sports_key
RESEND_API_KEY=REPLACE_WITH_LOCAL_VALUE
CONTACT_EMAIL=sylvesteredmonds18@gmail.com

EDITORIAL_PASSKEY=REPLACE_WITH_LOCAL_VALUE
CRON_SECRET=REPLACE_WITH_LOCAL_VALUE
INGEST_MAX_AGE_HOURS=96
```

| Variable | What it does |
| --- | --- |
| `EDITORIAL_PASSKEY` | The newsroom login key. Sent as the `x-editorial-token` header on every publish-affecting request. |
| `CRON_SECRET` | Authorises `/api/cron/ingest`. Vercel sends it as `Authorization: Bearer <secret>`. |
| `INGEST_MAX_AGE_HOURS` | How old a discovered story may be before it is discarded (default 96h). |

`.env.local` is gitignored — never commit it. `.env.example` is the committable
template.

---

## Step 3 — Start the dev server

Open the VS Code integrated terminal (``Ctrl+` ``) and run:

```bash
npm.cmd run dev
```

Wait for `Ready in …`. Leave this terminal running.

---

## Step 4 — Open the newsroom and sign in

1. Open `http://localhost:3000/editorial` in your browser.
2. Enter the passkey `digest2026` and confirm.
3. The desk unlocks: verification queue, filing panel, source health and
   coverage matrix.

---

## Step 5 — Verify the sources are reachable

Click **🔍 Check Feeds**.

The panel lists all 13 monitored sources with a status badge, item counts and
response time. Expect **13 / 13 `ok`**:

| Source | Tier |
| --- | --- |
| `gfa-official` (Ghana Football Association) | federation |
| `ghanasoccernet` | national_media |
| `ghana-sports-news` | national_media |
| `myjoy-sports` | national_media |
| `gnews-*` — 9 Google News queries, including the Ghana transfer search | wire_aggregator |

Below it, the **coverage matrix** proves every discipline has at least one
source: Football, Boxing, Athletics, Basketball, Armwrestling, Hockey,
Volleyball, Combat & Others — all `covered: true`.

---

## Step 6 — Run the crawler

Click **⚡ Run Crawler Now**.

- The engine fetches all 12 feeds in parallel (4 at a time, 10s timeout).
- Stories older than `INGEST_MAX_AGE_HOURS` are dropped.
- Duplicates are removed across sources by normalised headline.
- Everything lands in the queue as **pending** — the crawler never publishes.

Expect roughly **70–80 fresh stories** in about 6 seconds. The queue cap is 120
pending stories.

---

## Step 7 — Review and publish

Work the **verification queue** — every discovered story waits here.

1. Read the headline, source, timestamp and body.
2. Open the original article link to confirm the facts.
3. Click **✓ Publish Live** to approve, or **✕ Reject** to discard.

Approving stamps `publishedAt` and writes an audit trail
(`verifiedBy`, `verifiedAt`, `factChecked`, `sourceVerified`, `editorialNotes`).
Rejected stories are deleted from the store.

Tip: use **✏️ Edit** first if the crawled copy needs correcting — you can adjust
the headline, category, image and body before it goes out.

---

## Step 8 — File a story manually

Some stories never arrive via RSS — a correspondent dispatch, a federation
press release, a match report you wrote yourself.

1. Click **✍️ File Story**.
2. Fill in:
   - **Headline** — e.g. `Hearts of Oak edge Basake Holy Stars to go top of the GPL`
   - **Byline** — e.g. `Kwame Darko · Chief Football Analyst`
   - **Source / outlet** — e.g. `Ghana Football Association Match Commissioner`
   - **Source URL** — the original document
   - **Category** — pick from the dropdown (or leave blank for a preset image)
   - **Excerpt** — one or two sentences that carry the story
   - **Body** — the full verified copy
   - **Image** — paste an external image URL, or upload one
   - **Verification notes** — record the checklist, e.g.
     `Primary source confirmed with match commissioner / GFA dispatch.`
3. Click **✓ Verify & Publish Live**.

It enters the same queue and approval pipeline as crawled stories.

### Transfer stories from Ghana and International

Both newsroom desks can file transfer stories. Use the desk buttons at the top
of the Editorial Desk to choose **Ghana** or **International**.

1. Choose **File Story** and select **Transfers** as the category.
2. Enter the player, from/to clubs, deal type, fee and transfer window when
   these details are verified and available.
3. Leave the status as **Reported / Rumour** unless a club, player or other
   primary source confirms the move. Add the source name and URL.
4. File the story. It appears in the pending verification queue only.
5. Open the pending story, verify its details and source, then choose
   **Verify & Publish Live**. It then appears in the public Transfers page,
   marked as Ghana or International according to the desk used to file it.

The scheduled crawler also searches Ghana and international transfer feeds.
Automatically discovered transfer leads are labelled **Reported** and require
editor approval before appearing publicly.

---

## Step 9 — Confirm the public site is read-only

Open `http://localhost:3000` and go to **Ghana Sports News**.

- Only **approved** stories appear.
- There are **no approve / reject / ingest buttons** — the public view is
  strictly read-only.

You can confirm the enforcement from the terminal:

```bash
# Public read — only approved stories
curl http://localhost:3000/api/ghana-sports-news

# The verification queue — requires the editorial token
curl "http://localhost:3000/api/ghana-sports-news?status=all"
# → 401 "Only approved stories are public."

# Approving without the token — rejected
curl -X POST http://localhost:3000/api/ghana-sports-news \
  -H "content-type: application/json" \
  -d '{"action":"approve","id":"anything"}'
# → 401 "Editorial authorisation required."

# The cron without the secret — rejected
curl http://localhost:3000/api/cron/ingest
# → 401 "Unauthorized cron trigger."

# The breaking bulletin without the token — rejected
curl -X POST http://localhost:3000/api/newsletter/breaking-alert \
  -H "content-type: application/json" \
  -d '{"title":"x","excerpt":"y"}'
# → 401 "Only the editorial desk may dispatch a breaking bulletin."

# Image upload without the token — rejected
curl -X POST -F "file=@photo.jpg" http://localhost:3000/api/upload
# → 401 "Only the editorial desk may upload editorial images."
```

---

## Step 10 — Typecheck / production build

```bash
npm.cmd run build
```

`build` runs TypeScript, so it is the canonical "does it compile" check. There
is no separate lint script.

To serve the production build locally:

```bash
npm.cmd run start
```

Stop any server with `Get-Process node | Stop-Process -Force`.

---

## Step 11 — Deploy

### Set the environment variables in Vercel

`https://vercel.com` → your project → **Settings → Environment Variables**:

| Variable | Value |
| --- | --- |
| `EDITORIAL_PASSKEY` | `digest2026` (or a stronger key — also update `.env.local`) |
| `CRON_SECRET` | `935ac3f3b8b2c0c3bfba1f9417169f7500544c4cbc1fc52c` |

**If `CRON_SECRET` is not set, the scheduled crawl returns 401 and no stories
are discovered automatically.** The manual "⚡ Run Crawler Now" button still
works, because the newsroom sends the editorial token instead.

### Push to deploy

```bash
git add -A
git commit -m "Full-coverage Ghana sports newsroom: verified discovery, editorial approval, read-only public feed"
git push origin master
```

`vercel.json` already defines the cron at `*/30 * * * *` (every 30 minutes).

### On Vercel, storage is ephemeral

The project directory is read-only, so the newsroom store falls back to the OS
temp directory. The newsroom panel reports this as
`counts.persistentStorage.ephemeral: true` — a yellow warning, not an error.
Approved stories still go live, but they do not survive a redeploy. To make
storage durable, move the store to a hosted database (Vercel Postgres / KV)
or an external JSON blob.

---

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `401` on any newsroom action | Passkey mismatch. `EDITORIAL_PASSKEY` in `.env.local` must match what you type at `/editorial`. Restart the dev server after editing env files. |
| `401` from `/api/cron/ingest` | `CRON_SECRET` is not set, or the header is not `Authorization: Bearer <secret>`. |
| "Check Feeds" shows a source as failed | The publisher changed their feed URL or blocked the request. Update the URL in `app/components/lib/ghanaFeedRegistry.ts`. |
| Crawler returns 0 stories | Nothing newer than `INGEST_MAX_AGE_HOURS`. Raise it to `168` for a week-long window. |
| "Persistent storage: ephemeral" | Expected on Vercel — see above. |
| `next build` says "Another next build process is already running" | A previous build still holds the `.next/` lock. Wait for it to finish; do not kill the lock. |
| `next build` fails with `Cannot find name 'xtRequest'` in `.next/dev/types/validator.ts` | Stale dev-server artifacts leaked into the build. Run `Remove-Item -Recurse -Force .next` then `npm.cmd run build`. |
| Em dashes / emoji show as `���` | A file was edited with PowerShell `Get-Content`/`Set-Content`, which corrupts UTF-8. Restore with `git checkout -- <file>` and re-edit in VS Code. |

---

## How the pieces fit together

```
 RSS / Atom feeds  ─┐
 Google News wire  ─┤
 manual filing     ─┼─▶  automatedIngestionEngine  ─▶  GhanaNewsStore
 (newsroom form)   ─┘      (classify · dedupe ·        (pending queue,
                          freshness window)             capped at 120)
                                                        │
                                          editorial review (approve / reject / edit)
                                                        │
                                                        ▼
                                          public GET  →  only "approved"
```

Source registry: `app/components/lib/ghanaFeedRegistry.ts`
Ingestion engine: `app/components/lib/automatedIngestionEngine.ts`
Store: `app/components/lib/ghanaNewsStore.ts`
Auth guard: `app/components/lib/editorialAuth.ts`
Newsroom UI: `app/editorial/page.tsx`
Public view: `app/components/GhanaSportsNews.tsx`

### Routes behind the editorial token

Every one of these returns `401` without a valid `x-editorial-token`:

| Route | Why it is gated |
| --- | --- |
| `POST /api/ghana-sports-news` | approve / update / reject / reset / ingest / file story |
| `POST /api/upload` | writes files into `public/`, referenced by live articles |
| `POST /api/newsletter/breaking-alert` | mails subscribers — a publish action |
| `GET /api/cron/ingest` | also accepts `Authorization: Bearer <CRON_SECRET>` |
| `GET /api/ghana-sports-news?status=` (non-`approved`) | exposes the verification queue |
