# 03: Inserir recomendações reais e marcar TODO

> **Difficulty:** Light: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** Substituir os itens de exemplo pelas recomendações reais copiadas do LinkedIn por Conan (texto fiel, sem edição), na ordem escolhida, e marcar o item no TODO.md. Depende de Conan fornecer os textos.

**Seams:**
- Home `/` renderizada

**Blocked by:** 01: Seção de recomendações na home com fundo contínuo; 02: Truncar textos longos com "ler mais" acessível; input de Conan (textos das recomendações)

Status: ready-for-agent

- [x] Nenhum item de exemplo restante
- [x] Textos fiéis ao original; ordem do JSON respeitada
- [x] Item marcado no TODO.md
- [x] `pnpm check` e `pnpm build` passam
- [ ] Checagem manual da home
