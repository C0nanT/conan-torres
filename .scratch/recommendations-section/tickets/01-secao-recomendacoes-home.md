# 01: Seção de recomendações na home com fundo contínuo

> **Difficulty:** Standard: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** A seção "Recomendações" na home, entre Experiência e YouTube. Lê uma lista `recommendations` do JSON de conteúdo (tipo `SiteData` atualizado junto) e mostra cards com autor, cargo, relação, data e texto, mais link "Ver todas no LinkedIn" (URL do LinkedIn já em `site`) e link opcional para o perfil do autor. Textos fixos de UI vão para as mensagens em português. Fundo começa em `muted/30` chapado para emendar com o fim do gradiente da Experiência; divisor pontilhado mantido antes do YouTube. Lista vazia: seção não renderiza. Para demonstrar, incluir 1-2 itens claramente fictícios de exemplo no JSON (substituídos no ticket 03).

**Seams:**
- Home `/` renderizada

**Blocked by:** None (can start immediately)

Status: ready-for-agent

- [x] Seção aparece entre Experiência e YouTube na home
- [ ] Sem faixa/corte visível de fundo nas duas transições, em tema claro e escuro
- [ ] Grade 1 coluna no mobile, 2 no desktop
- [x] Autor sem link de perfil renderiza sem link; links externos com `rel="noopener noreferrer"` e foco visível
- [x] Lista vazia não renderiza a seção
- [x] Animações (se houver) só transform/opacity e respeitam `prefers-reduced-motion`
- [x] Texto renderizado no servidor (Server Component)
- [x] `pnpm check`, `pnpm exec tsc --noEmit` e `pnpm build` passam; checagem manual feita
