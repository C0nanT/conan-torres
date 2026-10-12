# 02: Reescrever README

> **Difficulty:** Light: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** README curto em pt descreve o site, a stack, como rodar e onde ficam conteúdo e textos, sem boilerplate T3.

**Seams:** None.

**Blocked by:** None (can start immediately)

Status: ready-for-agent

- [ ] Descreve o projeto, stack e comandos (`pnpm dev/build/check`, Node >= 22, `SKIP_ENV_VALIDATION`)
- [ ] Aponta conteúdo em `data/site.json` e textos em `messages/pt.json`
- [ ] Nenhum resto de boilerplate T3
- [ ] Verificação sem testes automáticos: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build`.
