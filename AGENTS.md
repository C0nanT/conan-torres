# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal site for Conan Torres (content creator / educator). Next.js 15 App Router, React 18, TypeScript, Tailwind 3, shadcn/ui (new-york) + Radix, Framer Motion / `motion`, `next-intl`. Started from create-t3-app; the T3 boilerplate is gone (no tRPC/Prisma/NextAuth, no env validation). Only the book reader reads env vars (`READER_PASSWORD`, `BOOK_FILE_*`, `DATA_DIR`, see Deploy); the rest of the site works without them.

## Commands

Package manager: pnpm (Node >= 22).

```bash
pnpm dev               # dev server (the book reader needs Turbopack, see below)
pnpm build             # production build (standalone output)
pnpm check             # biome lint + format check
pnpm check:fix         # biome auto-fix
pnpm exec tsc --noEmit # type check (no script for it)
```

`pnpm dev` (webpack) cannot open the book reader: loading `pdfjs-dist` throws `Object.defineProperty called on non-object`, and the reader's `error.tsx` ("O leitor encontrou um erro") replaces the viewer. `pdf.mjs` declares its own top-level `var __webpack_exports__`, which shadows webpack's in the dev `eval` wrapper; production builds concatenate modules and are fine, and Next reverts any `devtool` change in dev. To work on the reader, run `pnpm exec next dev --turbopack` or `pnpm build && pnpm start`.

No test framework is set up, and none is wanted: this is a portfolio site. Do not write or add tests, set up a test framework, or declare test seams, even when a skill (`tdd`, `to-spec`, `to-tickets`, `implement`, …) asks for them. Where a skill requires a testing section, write "no automated tests" and verify with `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build` and a manual check. Pre-commit hook (husky + lint-staged) runs `biome check --write` on staged files.

## Architecture

**Content lives in `data/site.json`, not in components.** Profile, social links, YouTube channels/videos, courses, about/philosophy copy, SEO keywords, site URL and Clarity ID are all there. `src/lib/site-data.ts` imports it, defines the `SiteData` type and exposes `site` plus helpers (`getSiteUrl`, `getOgImageUrl`, `getYouTubeVideoUrl`, …). When adding fields to `site.json`, update the `SiteData` interface too — the JSON is cast, not validated.

**UI strings live in `messages/pt.json`** (namespaces: navigation, common, hero, about, metadata, …), accessed via `useTranslations` / `getTranslations`.

**i18n is effectively Portuguese-only:**
- `src/lib/navigation.ts` declares `locales = ['pt']` with `localePrefix: 'never'` (URLs carry no locale); exports locale-aware `Link`, `redirect`, `usePathname`, `useRouter` — use these instead of `next/link`/`next/navigation`.
- `src/i18n.ts` always loads `pt` messages.
- `src/middleware.ts` rewrites every non-asset route into `src/app/[locale]/` (not `/api`).
- `src/app/[locale]/layout.tsx` still lists `['pt', 'en']` in `generateStaticParams` and has `pt`/`en` branches, on purpose (English planned), but there is no `messages/en.json`.

**Routing / layout:** `src/app/layout.tsx` is a thin root (metadataBase + Clarity, no `<html>`). `robots.ts`, `sitemap.ts`, `manifest.ts` and `global-error.tsx` live at `src/app/` root, not under `[locale]` (robots and manifest are not served from there). The real `<html>` shell is `src/app/[locale]/layout.tsx`: JSON-LD structured data, Geist fonts, `NextIntlClientProvider`, `Toaster`. Below it are three route groups:
- `(site)/`: every public page (`(home)`, `about`, `books`, `certificates`, `projects`). Its `layout.tsx` adds `Navigation`, `RouteTransition`, `Footer` and the WhatsApp button; it also holds the site's `error.tsx`, `loading.tsx` and `not-found.tsx`.
- `(unmatched)/`: only `[...rest]/page.tsx`, which calls `notFound()`, so URLs that match no page get the styled 404 with a 404 status. It re-exports the `(site)` layout and not-found page. It sits outside `(site)` on purpose: a page under a `loading.tsx` streams, and its `notFound()` then answers 200. A segment `not-found.tsx` alone only catches `notFound()` calls, and a root one would render without the `<html>` shell.
- `(reader)/`: the full-screen book reader (`books/[id]/ler`), with no site chrome, plus its own `error.tsx` and `not-found.tsx`. `ler/loading.tsx` says the first open downloads the book; `ler/layout.tsx` checks the book id before that boundary for the same 404-status reason.

Page-specific components live in colocated `_components/` folders with an `index.ts` barrel (e.g. `src/app/[locale]/(site)/(home)/_components/`). Metadata per page goes through `generateLocalizedMetadata(locale, page)` in `src/lib/metadata.ts`, which reads the `metadata` message namespace + `site.json`.

**Components:** `src/components/ui` (shadcn primitives + custom animated pieces like navigation-dock, route-transition, fancy-button), `src/components/layout` (nav/footer), `src/components/common` (logos, whatsapp-floating-button). `cn()` is in `src/lib/shadcn.ts` (shadcn alias `utils`); `tv` (tailwind-variants) is re-exported from `src/utils/tv.ts`. Path alias `@/*` → `src/*`.

Remote images must be whitelisted in `next.config.mjs` `images.remotePatterns` (currently only YouTube thumbnails).

## Deploy

Own VPS: `docker compose up -d --build` (`docker-compose.yml`, single `web` service built from the `Dockerfile`, port 8080 on host and container). One named volume, `leitor-data` at `/app/reader-data`, holds the book reader's SQLite file (see **Reader data**); everything else in the container is reset by an image rebuild.

- `next.config.mjs`: `output: 'standalone'`; `outputFileTracingRoot` is pinned to the project folder.
- `Dockerfile`: multi-stage. The builder (`node:22-alpine`) runs `pnpm install --frozen-lockfile` and `pnpm build`. The runtime stage copies only `.next/standalone`, `.next/static` and `public`, runs as the non-root `node` user with `node server.js`, and sets `HOSTNAME=0.0.0.0`, `PORT=8080`, `DATA_DIR=/app/reader-data`, `EXPOSE 8080`. It creates `/app/reader-data` owned by `node` before `USER node`. Compose does not override `command`.
- `.dockerignore` keeps `.env*` (except `.env.example`), `.git`, host `node_modules` and `.next`, tool folders (`.claude`, `.cursor`, `.scratch`, `.vscode`, `.husky`, `.github`), `docs` and markdown out of the image.
- `sharp` ships in the standalone output, so `next/image` works at runtime. So does `better-sqlite3`: Next externalizes it on its own (no `serverExternalPackages`), and the trace copies its native `build/Release/better_sqlite3.node` into `.next/standalone/node_modules`. The alpine builder needs no build tools because `pnpm install` downloads the prebuilt musl binary from GitHub releases. If that download is ever blocked, it falls back to node-gyp, and the builder then needs `apk add python3 make g++`. pnpm >= 10 blocks install scripts, so an upgrade must add `better-sqlite3` to `pnpm.onlyBuiltDependencies`.

**Environment variables** (book reader only; `.env.example` lists them). On the VPS they live in an uncommitted `.env` next to `docker-compose.yml`, whose `environment:` passes `READER_PASSWORD` and every `BOOK_FILE_*` (today only `BOOK_FILE_MONOLITO_PARA_MICROSSERVICOS`) as `${VAR:-}`; `DATA_DIR` is not passed, the Dockerfile sets it. Never commit a real value, not even a placeholder one.
- `READER_PASSWORD`: unlocks `/books/<id>/ler`. Unset or blank: the reader refuses access with a message, and every other page still works. A correct password sets a 30-day httpOnly, sameSite, HMAC-signed cookie whose key derives from the password with scrypt (slow on purpose, computed once per process), so changing it signs out every device.
- `BOOK_FILE_<BOOK_ID_IN_CONSTANT_CASE>` (e.g. `BOOK_FILE_MONOLITO_PARA_MICROSSERVICOS`): Google Drive file ID (just the ID, never a URL) of the book's PDF, shared as "anyone with the link". One per book with `readable: true`; add the name to `.env.example` and to `docker-compose.yml` (`${VAR:-}`) when a book becomes readable. Unset: the reader shows a message and logs it.
- `DATA_DIR`: folder of the reader's SQLite file. The Dockerfile sets it to `/app/reader-data` (the volume). Do not override it on the VPS. Unset (local `pnpm start`/`pnpm dev`): `./data-local`, which is gitignored and dockerignored.

**Reader access** goes through `src/lib/reader-access.ts` alone (`getReader()` returns the owner `conan` or `null`, plus `signIn`/`signOut`); protected pages, actions and routes must not read the cookie themselves. The future login replaces only that module. Wrong passwords are rate-limited in memory by `src/lib/reader-rate-limit.ts`: 3 failures lock the client IP for 20 min, and a restart clears every lock. Each attempt is counted before the password is compared (a right one clears it), so a parallel burst stops at 3; idle entries expire after the lock window and the map keeps at most 10 000 IPs. The IP is the first hop of `x-forwarded-for`; when no proxy sends that header, Next's server fills it with the socket address (`x-real-ip`, then a shared `unknown` bucket, are last-resort fallbacks). The header is trusted as-is, so the reverse proxy in front of the container must overwrite `x-forwarded-for` (not append to it), and compose publishes port 8080 on all host interfaces, so a client that reaches it directly can set the header itself; the VPS proxy setup has not been verified.

**Book PDFs** are downloaded by `src/lib/book-file.ts` from `drive.usercontent.google.com/download` on the first read (the server follows Drive's large-file confirmation form; anything that is not `%PDF-` is rejected) and cached at `/app/.next/cache/book-files/<book-id>.pdf`. The browser only ever sees `/api/books/<id>/file`, which requires `getReader()` (401 otherwise) and never exposes the Drive ID or URL. To refresh after replacing the file in Drive, delete the cached file and reload the reader: `docker compose exec web rm /app/.next/cache/book-files/<book-id>.pdf`. A rebuild also clears it: the PDF cache stays in `.next/cache`, not in the data volume. Failures show a Portuguese message in the reader and write one line prefixed `[book-file]` (ISO timestamp, `livro=<id>`, `motivo=<code>`, optional `detalhe`; never the file ID or URL): `docker compose logs web | grep book-file`. Reason codes: `missing-env`, `invalid-book-id`, `not-found` (bad ID), `drive-failed`, `not-pdf` (private file or error page), `confirm-page`, `too-large`, `io-error`.

**Reader data** (saved page, total pages, and highlights from ticket 06) lives in one SQLite file, `$DATA_DIR/leitor.db`, written with `better-sqlite3`.
- Layers: `src/lib/reader-db.ts` owns the connection and the schema. `src/lib/reading-position.ts` (`getReadingPosition`, `saveCurrentPage`, `setTotalPages`) and `src/lib/highlights.ts` (`listHighlights`, `createHighlight`, `deleteHighlight`) are the only code with SQL, all scoped by owner and book. `getReadableBook(id)` in `site-data.ts` is the one check that a book id exists and is `readable`; the page, the actions and both route handlers use it. Pages and server actions call those functions, never SQL, and the owner always comes from `getReader()`. `src/lib/page-number.ts` holds the page-number validation shared by the form and the action; it is pure, so it is safe in the browser. `src/lib/highlight-rules.ts` is the same for highlights (colour set, caps, rect/page validation, shared by the composer and `highlight-actions.ts`). Highlight rects are fractions of the page box, so they redraw at any zoom; only one page renders at a time, so a selection never spans pages, and one that ends outside the text layer is clamped to the page's part.
- The connection opens lazily on the first query, never at module load, so `pnpm build` needs no database or volume. The first open creates the folder, then applies the schema idempotently through `PRAGMA user_version` (append a new step to `MIGRATIONS` and never edit a released one).
- Tables: `reading_positions` (`owner`, `book_id`, `current_page`, `total_pages`, `updated_at`; primary key `(owner, book_id)`) and `highlights` (`id`, `owner`, `book_id`, `page`, `color`, `text`, `note`, `rects` JSON, `created_at`).
- `total_pages` is written the first time the viewer loads the PDF, and again if the page count changes. `current_page` and `updated_at` stay `NULL` until a page is saved from the "Parei na página" field. Nothing saves automatically, and the browser keeps no copy of the position.
- The journal mode is the default rollback mode (`DELETE`, no `-wal`/`-shm` files), so `leitor.db` alone is the whole database.
- Failures log one line prefixed `[reader-db]` (ISO timestamp, `operacao=<op>`, `erro=<message>`). If the database is unreadable, the reader still opens on page 1, and saving shows an error.
- **Public progress** is decided in `src/lib/book-progress.ts` (`getBooks()`): a `readable` book with a saved page shows `round(current_page / total_pages * 100)` and the `updated_at` day in São Paulo (converted to `YYYY-MM-DD` there, the same shape as `site.json`'s dates, which render as UTC); every other book keeps `progress` / `progressUpdatedAt` from `site.json`. The books page renders per request (`connection()`) and reads the database each time, so a deploy never serves build-time numbers over a populated volume; at build, or if the database is unreadable (one `[reader-db]` line, `operacao=ler-progresso`), `site.json` is used. `savePage` calls `revalidateBookProgress()`; any new page that shows book progress must read `getBooks()` and be added there.
- **Export** exists: the reader's "Exportar grifos" button downloads `GET /api/books/<id>/highlights/export` (saved page and every highlight, as JSON, owner-gated, `no-store`). Import does not exist.

Volume and backup:
- Inspect the volume: `docker volume inspect conan-torres_leitor-data`. The prefix is the compose project name, which is the folder name by default.
- Back up, consistent even while the site runs: `docker compose exec web node -e "new (require('better-sqlite3'))('/app/reader-data/leitor.db').backup('/app/reader-data/backup.db').then(()=>console.log('ok'))"`, then `docker compose cp web:/app/reader-data/backup.db ./leitor-$(date +%F).db`. A plain `docker compose cp web:/app/reader-data/leitor.db ./` is also fine when no save is happening at that moment.
- Restore: `docker compose cp ./leitor.db web:/app/reader-data/leitor.db`, then `docker compose restart web`.
- A brand-new volume inherits `node:node` from the image's `/app/reader-data`. A volume that already exists and is root-owned (created before that `chown`, or by hand) stays root-owned, and the first save fails with a permission error. Fix it once with `docker run --rm -v conan-torres_leitor-data:/d alpine chown -R 1000:1000 /d`.
- `docker compose down -v` deletes the volume and every saved page and highlight. Plain `down` and `up -d --build` keep it.
- Do not move the mount to `/app/data`: the standalone trace copies `data/*.json` there, and a volume would shadow them.

**YouTube live numbers live in the Next.js cache.** `src/lib/youtube-live-stats.ts` scrapes views/subscribers/video counts inside `unstable_cache` (24 h revalidate) and falls back to the `site.json` values when a scrape fails with no cached value. The cache writes to `/app/.next/cache` in the runtime image; `/app/.next` is copied with `--chown=node:node`, so the non-root user can write there. The cache is not carried from the build stage, so every rebuild resets it. The home page is prerendered during `pnpm build`: its HTML holds the build-time numbers, and that scrape is the first refetch. The first request after each 24 h window refetches. A post-deploy change in the numbers, or `site.json` values showing until the next window when the build-time scrape failed, is expected behaviour.

**Logs:** `docker compose logs web` (add `-t` for Docker timestamps, `--since 24h` to narrow). Capped by the `json-file` driver at 3 × 1 MB; older entries are discarded. Each failed scrape writes one line prefixed `[youtube-stats]` (ISO timestamp, target type and id, reason, whether the `site.json` fallback was used) and a target that recovers writes one `recuperado` line; successes are silent. `docker compose logs web | grep youtube-stats` filters them out of Next's own multi-line `revalidating cache with key` traces, which accompany background failures.

## Conventions

Biome (`biome.json`) is strict and enforced; notable rules:
- Single quotes, no semicolons, 2-space indent, 80-col lines, ES5 trailing commas.
- `noForEach` (use `for...of`/`map`), `noArrayIndexKey`, `noExplicitAny`, `useBlockStatements`, `useImportType`, `useAwait`, `noConsoleLog` (warn).
- `useNamingConvention`: functions camelCase/PascalCase, variables camelCase/CONSTANT_CASE/PascalCase, types PascalCase.
- a11y rules are errors (`useButtonType`, `useAltText`, `noBlankTarget`, `useKeyWithClickEvents`, …).

From `.cursor/rules/`:
- kebab-case file and directory names; PascalCase components/types; event handlers prefixed `handle`, booleans `is/has/can`.
- Functional/declarative code, early returns, no classes; prefer Server Components, `'use client'` only where needed.
- Animations: purposeful, compositor-friendly properties (transform/opacity), interruptible, and must respect `prefers-reduced-motion` (see `.cursor/rules/animation-guidelines.mdc` for the full Framer Motion guidance).

## SOLID

Apply SOLID at the **architecture** level: module boundaries, dependency direction, and the interfaces between them. It is a way to shape seams, not a naming ritual. "Module" means whatever this codebase groups behaviour into: a class, a package, a file of functions, a service.

### Scope: boy scout rule

SOLID applies to:

- code written new in the current change, and
- the existing code the current flow already passes through, when a small local edit clears friction that change is hitting.

The rest of the codebase stays as it is. Keep a change's blast radius on the flow being built or fixed: a repo-wide SOLID refactor is its own piece of work, and happens only when explicitly asked for. The codebase converges one change at a time.

When applying a principle would require reshaping modules outside the current flow, leave them alone and say so in the summary of the change.

### The principles, as architecture rules

- **SRP**: a module has one reason to change. When one flow forces edits in a module that other flows also own for unrelated reasons, that module is holding two responsibilities.
- **OCP**: new behaviour arrives as a new implementation behind an existing interface, rather than another branch in a growing conditional over kinds of thing.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: one root `CONTEXT.md` plus `docs/adr/`, both created lazily. See `docs/agents/domain.md`.
