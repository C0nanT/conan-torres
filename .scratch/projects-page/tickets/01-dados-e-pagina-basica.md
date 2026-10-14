# 01: Dados e página básica de projetos

> **Difficulty:** Standard: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** O visitante abre `/projects` pela navegação e vê uma grade de cards simples, um por projeto escolhido por Conan. A lista vem da junção dos dados do GitHub (nome, linguagem, URL do repo, homepage) com uma nova lista em `site.json` (nome do repo, descrição em português), na ordem escrita ali. Cada card mostra nome, descrição, linguagem, link "Código" e link "Demo" (só se houver homepage), com links externos em nova aba. A junção fica num módulo próprio em `src/lib`, e a página só renderiza. Se um nome em `site.json` não existir no GitHub JSON, o build falha com erro claro. A lista inicial usa os repos hoje marcados `featured` e não-fork, com a descrição em português como campo a preencher. A página tem título, subtítulo, metadata própria e entrada no sitemap, com textos em `messages/pt.json`.

**Seams:** None (sem testes automatizados, ver `AGENTS.md`).

**Blocked by:** None (can start immediately).

Status: ready-for-agent

- [ ] `/projects` abre sem 404 e mostra um card por projeto de `site.json`, na ordem da lista
- [ ] Cada card tem nome, descrição, linguagem e link "Código" em nova aba
- [ ] "Demo" aparece só quando o repo tem homepage
- [ ] Nome inexistente no GitHub JSON quebra `pnpm build` com mensagem clara
- [ ] Tipo `SiteData` atualizado com os novos campos
- [ ] Textos em `messages/pt.json`, metadata via `generateLocalizedMetadata`, entrada no `sitemap.ts`
- [ ] `pnpm check`, `pnpm exec tsc --noEmit` e `pnpm build` passam
