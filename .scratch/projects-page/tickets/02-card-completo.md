# 02: Card completo: stack, imagem, hover e grade

> **Difficulty:** Standard: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** Os cards ganham o visual final. Mostram as tags da stack e uma imagem do projeto (de `public/projects/`, caminho opcional em `site.json`); sem imagem, aparece um fundo padrão com a linguagem ou um ícone, para a grade ficar uniforme. A grade tem 1 coluna no celular e 2 no desktop. Ao passar o mouse, o card sobe levemente e a borda ganha realce, usando só `transform`/`opacity` (e cor da borda), de forma interrompível e desativada com `prefers-reduced-motion`. A animação de entrada segue as outras páginas. Links têm foco visível e texto descritivo.

**Seams:** None (sem testes automatizados, ver `AGENTS.md`).

**Blocked by:** 01: Dados e página básica de projetos.

Status: ready-for-agent

- [x] Tags da stack aparecem no card
- [x] Imagem aparece quando existir; senão, fundo padrão sem espaço vazio
- [x] Grade de 1 coluna no celular e 2 no desktop
- [x] Hover discreto, desativado com `prefers-reduced-motion`
- [x] Foco por teclado visível nos links
- [ ] Verificação manual em desktop e celular
- [x] `pnpm check`, `pnpm exec tsc --noEmit` e `pnpm build` passam
