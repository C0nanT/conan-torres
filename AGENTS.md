# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal site for Conan Torres (content creator / educator). Next.js 15 App Router, React 18, TypeScript, Tailwind 3, shadcn/ui (new-york) + Radix, Framer Motion / `motion`, `next-intl`. Started from create-t3-app; the T3 boilerplate is gone (no tRPC/Prisma/NextAuth, no env validation). The site needs no env vars.

## Commands

Package manager: pnpm (Node >= 22).

```bash
pnpm dev               # dev server
pnpm build             # production build (standalone output)
pnpm check             # biome lint + format check
pnpm check:fix         # biome auto-fix
pnpm exec tsc --noEmit # type check (no script for it)
```

No test framework is set up, and none is wanted: this is a portfolio site. Do not write or add tests, set up a test framework, or declare test seams, even when a skill (`tdd`, `to-spec`, `to-tickets`, `implement`, …) asks for them. Where a skill requires a testing section, write "no automated tests" and verify with `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build` and a manual check. Pre-commit hook (husky + lint-staged) runs `biome check --write` on staged files.

## Architecture

**Content lives in `data/site.json`, not in components.** Profile, social links, YouTube channels/videos, courses, about/philosophy copy, SEO keywords, site URL and Clarity ID are all there. `src/lib/site-data.ts` imports it, defines the `SiteData` type and exposes `site` plus helpers (`getSiteUrl`, `getOgImageUrl`, `getYouTubeVideoUrl`, …). When adding fields to `site.json`, update the `SiteData` interface too — the JSON is cast, not validated.

**UI strings live in `messages/pt.json`** (namespaces: navigation, common, hero, about, metadata, …), accessed via `useTranslations` / `getTranslations`.

**i18n is effectively Portuguese-only:**
- `src/lib/navigation.ts` declares `locales = ['pt']` with `localePrefix: 'never'` (URLs carry no locale); exports locale-aware `Link`, `redirect`, `usePathname`, `useRouter` — use these instead of `next/link`/`next/navigation`.
- `src/i18n.ts` always loads `pt` messages.
- `src/middleware.ts` rewrites every non-asset route into `src/app/[locale]/`.
- `src/app/[locale]/layout.tsx` still lists `['pt', 'en']` in `generateStaticParams` and has `pt`/`en` branches, on purpose (English planned), but there is no `messages/en.json`.

**Routing / layout:** `src/app/layout.tsx` is a thin root (metadataBase + Clarity). `robots.ts`, `sitemap.ts`, `manifest.ts` and `global-error.tsx` live at `src/app/` root, not under `[locale]` (robots and manifest are not served from there). The real `<html>` shell is `src/app/[locale]/layout.tsx`: JSON-LD structured data, Geist fonts, `NextIntlClientProvider`, `Navigation`, `RouteTransition`, `Footer`. Page-specific components live in colocated `_components/` folders with an `index.ts` barrel (e.g. `src/app/[locale]/(home)/_components/`). Metadata per page goes through `generateLocalizedMetadata(locale, page)` in `src/lib/metadata.ts`, which reads the `metadata` message namespace + `site.json`.

**Components:** `src/components/ui` (shadcn primitives + custom animated pieces like navigation-dock, route-transition, fancy-button), `src/components/layout` (nav/footer), `src/components/common` (logos, whatsapp-floating-button). `cn()` is in `src/lib/shadcn.ts` (shadcn alias `utils`); `tv` (tailwind-variants) is re-exported from `src/utils/tv.ts`. Path alias `@/*` → `src/*`.

Remote images must be whitelisted in `next.config.mjs` `images.remotePatterns` (currently only YouTube thumbnails).

## Deploy

Own VPS: `docker compose up -d --build` (`docker-compose.yml`, single `web` service built from the `Dockerfile`, port 8080 on host and container). No volumes, so nothing persists across image rebuilds.

- `next.config.mjs`: `output: 'standalone'`; `outputFileTracingRoot` is pinned to the project folder.
- `Dockerfile`: multi-stage. The builder (`node:22-alpine`) runs `pnpm install --frozen-lockfile` and `pnpm build`. The runtime stage copies only `.next/standalone`, `.next/static` and `public`, runs as the non-root `node` user with `node server.js`, and sets `HOSTNAME=0.0.0.0`, `PORT=8080`, `EXPOSE 8080`. Compose does not override `command`.
- `.dockerignore` keeps `.env*` (except `.env.example`), `.git`, host `node_modules` and `.next`, tool folders (`.claude`, `.cursor`, `.scratch`, `.vscode`, `.husky`, `.github`), `docs` and markdown out of the image.
- `sharp` ships in the standalone output, so `next/image` works at runtime.

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
