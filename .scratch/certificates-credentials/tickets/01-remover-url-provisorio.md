# 01: Remover link provisório das certificações

> **Difficulty:** Light: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** nenhuma certificação aponta mais para `google.com`. Em `/certificates` nenhum item mostra botão de link até haver comprovante real.

**Seams:** None (sem testes automáticos; ver AGENTS.md).

**Blocked by:** None (can start immediately)

Status: ready-for-human

- [x] Nenhum `url` provisório resta em `data/certifications.json`
- [x] `/certificates` renderiza os 25 itens sem botão de link
- [x] Verificação sem testes automáticos: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build`.
