# 03: Card "Certificações" do hero leva a `/certificates`

> **Difficulty:** Light: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** clicar no card "Certificações" do hero leva o visitante à página `/certificates`, do mesmo jeito que o card de projetos já leva ao destino dele (mecanismo de `href` existente, com o `Link` localizado do projeto). O número exibido continua vindo de `profile.stats.certifications`.

**Seams:** None (sem testes automatizados, decisão do usuário).

**Blocked by:** 01: Página `/certificates` com a lista de certificações.

Status: ready-for-agent

- [x] Clique no card navega para `/certificates`
- [x] Card ganha o mesmo estilo de hover dos outros cards clicáveis; os cards sem destino não mudam
- [x] O número continua vindo de `profile.stats.certifications`
- [ ] `pnpm check`, `pnpm exec tsc --noEmit` passam
