# 01: Ligar Microsoft Clarity

> **Difficulty:** Light: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** com o ID do projeto, o site carrega Clarity de forma não bloqueante; sem ID, nada carrega.

**Seams:** None.

**Blocked by:** None no código, mas depende de Conan criar o projeto no Clarity e passar o ID (adiado no TODO).

Status: ready-for-agent

- [ ] ID gravado em `site.analytics.clarityId`
- [ ] Carregamento não bloqueante conferido
- [ ] Manual: com ID há request para `clarity.ms`; sem ID nenhum
- [ ] Verificação sem testes automáticos: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build`.
