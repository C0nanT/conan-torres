# 02: Corrigir ano da graduação e número de certificações do hero

> **Difficulty:** Light: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** `profile.education.year` reflete a conclusão do ADS (jul. 2025) e o número de certificações do hero bate com o critério decidido por Conan (suposição: manter 25, contando todos os itens da página).

**Seams:** None.

**Blocked by:** None (can start immediately). Confirmar com Conan as duas suposições da spec antes de editar; se ele escolher contar só cursos, atualizar `profile.stats.certifications` e qualquer texto do hero que diga o contrário.

Status: ready-for-agent

- [ ] `profile.education.year` = 2025 (ou valor confirmado)
- [ ] Número do hero igual ao critério confirmado
- [ ] Verificação sem testes automáticos: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build`.
