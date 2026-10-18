# 02: Truncar textos longos com "ler mais" acessível

> **Difficulty:** Standard: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** Recomendações longas aparecem truncadas no card, com controle "ler mais / ler menos" que expande o texto completo. O texto completo continua no HTML do servidor (indexável). Só o controle de expandir é client.

**Seams:**
- Home `/` renderizada

**Blocked by:** 01: Seção de recomendações na home com fundo contínuo

Status: ready-for-agent

- [x] Texto longo truncado por padrão; curto sem controle
- [x] Botão com `type="button"`, `aria-expanded` e foco visível; operável por teclado
- [x] Texto completo presente no HTML inicial
- [x] Expansão respeita `prefers-reduced-motion`
- [x] `pnpm check`, `pnpm exec tsc --noEmit` e `pnpm build` passam
- [ ] Checagem manual feita
