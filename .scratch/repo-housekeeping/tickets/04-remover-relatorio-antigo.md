# 04: Remover relatório de bugs do site antigo

> **Difficulty:** Light: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** o relatório do site de Augusto Galego sai do repo; o bug do formulário de contato fica registrado num ticket atual e o `AGENTS.md` deixa de apontar para o relatório.

**Seams:** None.

**Blocked by:** None (can start immediately)

Status: ready-for-human

- [x] Ticket em `.scratch/` registra o form de contato não funcional
- [x] `REMAINING_ISSUES_REPORT.md` removido
- [x] Menção no `AGENTS.md` atualizada
- [x] Verificação sem testes automáticos: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build`.
