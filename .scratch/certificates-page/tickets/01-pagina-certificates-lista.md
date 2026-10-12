# 01: Página `/certificates` com a lista de certificações

> **Difficulty:** Standard: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** o visitante acessa `/certificates` e vê todas as certificações de Conan, da mais recente para a mais antiga (`issuedAt` decrescente; empates mantêm a ordem do JSON). Cada item mostra título, emissor, data formatada em pt-BR (ex.: "mai. 2026") e competências. A página tem título e descrição próprios (metadata e textos no namespace de mensagens) e aparece no sitemap. Segue o padrão da página `about`: server component, componentes em `_components/` com barrel, `generateLocalizedMetadata`. Layout legível em tela estreita, animações só com transform/opacity e respeitando `prefers-reduced-motion`. Neste ticket nenhum item tem link.

**Seams:** None (sem testes automatizados, decisão do usuário).

**Blocked by:** None (can start immediately).

Status: ready-for-human

- [x] `/certificates` renderiza os 25 itens ordenados do mais recente ao mais antigo
- [x] Cada item exibe título, emissor, data em pt-BR e competências (itens sem competências não mostram bloco vazio)
- [x] Textos vêm de `messages/pt.json` (namespaces `certificates` e `metadata.certificates` com `title`, `description`, `keywords`)
- [x] `/certificates` está no sitemap
- [x] Layout ok em celular, foco visível, `prefers-reduced-motion` respeitado
- [x] `pnpm check`, `pnpm exec tsc --noEmit` e `pnpm build` passam
