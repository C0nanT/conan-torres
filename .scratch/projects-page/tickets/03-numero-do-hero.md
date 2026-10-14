# 03: Número do hero calculado da lista

> **Difficulty:** Light: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** O card "Projetos Relevantes Publicados" do hero passa a mostrar a quantidade de projetos da lista de `/projects`, em vez do número digitado à mão. O campo antigo `relevantProjects` deixa de ser usado e sai do `site.json` e do tipo.

**Seams:** None (sem testes automatizados, ver `AGENTS.md`).

**Blocked by:** 01: Dados e página básica de projetos.

Status: ready-for-human

- [x] O número do hero é igual à quantidade de cards em `/projects`
- [x] `relevantProjects` removido de `site.json` e do tipo, sem referências restantes
- [x] `pnpm check`, `pnpm exec tsc --noEmit` e `pnpm build` passam
