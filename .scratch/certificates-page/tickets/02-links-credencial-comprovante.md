# 02: Links de credencial e comprovante

> **Difficulty:** Standard: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** quando uma certificação tem `url` (credencial) e/ou `file` (comprovante), a página oferece esses destinos; quando não tem nenhum, o item aparece sem link. A regra fica numa função pura que recebe uma certificação e devolve os destinos disponíveis (credencial, arquivo ou nenhum), separada da apresentação; a UI só renderiza o que ela devolve. Com os dois, a credencial é a ação principal e o arquivo a secundária. Links abrem em nova aba com `target="_blank"` e `rel="noopener noreferrer"`. Rótulos "Ver credencial" / "Ver comprovante" vêm das mensagens. Basta preencher `file`/`url` no JSON para o link aparecer, sem mudar código.

**Seams:** None (sem testes automatizados, decisão do usuário).

**Blocked by:** 01: Página `/certificates` com a lista de certificações.

Status: ready-for-agent

- [x] Item sem `url` e sem `file` não renderiza âncora
- [x] Item só com `url` ou só com `file` mostra um link para o destino certo
- [x] Item com os dois mostra credencial como principal e arquivo como secundário
- [x] Todos os links externos têm `target="_blank"` e `rel="noopener noreferrer"`
- [x] Links têm texto descritivo e foco visível (inclui o título da certificação no nome acessível)
- [ ] Conferência manual preenchendo temporariamente `url`/`file` em alguns itens e revertendo; `pnpm check`, `tsc` e `build` passam
