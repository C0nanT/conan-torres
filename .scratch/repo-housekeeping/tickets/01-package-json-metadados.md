# 01: Metadados do package.json

> **Difficulty:** Light: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** `package.json` identifica Conan Torres como autor e o repositório correto.

**Seams:** None.

**Blocked by:** None (can start immediately)

Status: ready-for-agent

- [ ] `author` = Conan Torres
- [ ] `repository` = https://github.com/C0nanT/conan-torres
- [ ] Remote `origin` conferido (somente leitura, sem git destrutivo)
- [ ] Verificação sem testes automáticos: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build`.
