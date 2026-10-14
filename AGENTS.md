# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal site for Conan Torres (content creator / educator). Next.js 15 App Router, React 18, TypeScript, Tailwind 3, shadcn/ui (new-york) + Radix, Framer Motion / `motion`, `next-intl`. Bootstrapped from create-t3-app, but only the env validation remains (no tRPC/Prisma/NextAuth — the README is stock T3 boilerplate).

## Commands

Package manager: pnpm (Node >= 22).

```bash
pnpm dev               # dev server
pnpm build             # production build (also validates env via src/env.mjs)
pnpm check             # biome lint + format check
pnpm check:fix         # biome auto-fix
pnpm exec tsc --noEmit # type check (no script for it)
```

No test framework is set up, and none is wanted: this is a portfolio site. Do not write or add tests, set up a test framework, or declare test seams, even when a skill (`tdd`, `to-spec`, `to-tickets`, `implement`, …) asks for them. Where a skill requires a testing section, write "no automated tests" and verify with `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build` and a manual check. Pre-commit hook (husky + lint-staged) runs `biome check --write` on staged files. Set `SKIP_ENV_VALIDATION=1` to bypass env validation (used for Docker builds).

## Architecture

**Content lives in `data/site.json`, not in components.** Profile, social links, YouTube channels/videos, courses, about/philosophy copy, SEO keywords, site URL and Clarity ID are all there. `src/lib/site-data.ts` imports it, defines the `SiteData` type and exposes `site` plus helpers (`getMainYouTubeChannel`, `getOgImageUrl`, `getYouTubeVideoUrl`, …). When adding fields to `site.json`, update the `SiteData` interface too — the JSON is cast, not validated.

**UI strings live in `messages/pt.json`** (namespaces: navigation, common, search, hero, about, metadata, …), accessed via `useTranslations` / `getTranslations`.

**i18n is effectively Portuguese-only:**
- `src/lib/navigation.ts` declares `locales = ['pt']` with `localePrefix: 'never'` (URLs carry no locale); exports locale-aware `Link`, `redirect`, `usePathname`, `useRouter` — use these instead of `next/link`/`next/navigation`.
- `src/i18n.ts` always loads `pt` messages.
- `src/middleware.ts` rewrites every non-asset route into `src/app/[locale]/`.
- `src/app/[locale]/layout.tsx` still lists `['pt', 'en']` in `generateStaticParams` and has `pt`/`en` branches, but there is no `messages/en.json`.

**Routing / layout:** `src/app/layout.tsx` is a thin root (metadataBase + Clarity). The real `<html>` shell is `src/app/[locale]/layout.tsx`: JSON-LD structured data, Geist fonts, `NextIntlClientProvider`, `Navigation`, `RouteTransition`, `Footer`. Page-specific components live in colocated `_components/` folders with an `index.ts` barrel (e.g. `src/app/[locale]/(home)/_components/`). Metadata per page goes through `generateLocalizedMetadata(locale, page)` in `src/lib/metadata.ts`, which reads the `metadata` message namespace + `site.json`.

**Components:** `src/components/ui` (shadcn primitives + custom animated pieces like dock, page/route transitions, search), `src/components/layout` (nav/footer), `src/components/common` (logo, avatar, newsletter). `cn()` is in `src/lib/shadcn.ts` (shadcn alias `utils`); `tv` (tailwind-variants) is re-exported from `src/utils/tv.ts`. Path alias `@/*` → `src/*`.

Remote images must be whitelisted in `next.config.mjs` `images.remotePatterns` (currently YouTube thumbnails, Amazon, ghchart).

Known open bugs are tracked as tickets under `.scratch/` (e.g. non-functional contact form: `.scratch/repo-housekeeping/tickets/05-contact-form-nao-funcional.md`).

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
