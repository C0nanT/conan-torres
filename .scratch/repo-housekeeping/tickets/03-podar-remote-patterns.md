# 03: Podar remotePatterns não usados

> **Difficulty:** Standard: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** `images.remotePatterns` lista só hosts realmente renderizados via `next/image`; nenhuma imagem existente quebra.

**Seams:** None.

**Blocked by:** None (can start immediately)

Status: ready-for-agent

- [ ] Buscado uso real de Amazon (capas de livros) e `ghchart.rshah.org` em componentes e dados
- [ ] Hosts sem uso removidos; `img.youtube.com` mantido
- [ ] Checagem manual: home e `/about` sem imagem quebrada
- [ ] Verificação sem testes automáticos: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build`.
