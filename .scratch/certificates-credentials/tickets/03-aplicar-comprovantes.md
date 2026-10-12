# 03: Aplicar comprovantes reais às certificações

> **Difficulty:** Light: **suggested model:** Sonnet (Claude Code) / Sonnet (Cursor). Suggestion only, use whatever model you have to hand.

**Spec:** ../SPEC.md

**What to build:** cada certificação cujo comprovante Conan entregar passa a abrir o link de credencial e/ou o arquivo em nova aba; as sem comprovante seguem sem botão. Pode rodar em lotes.

**Seams:** None.

**Blocked by:** 01 (remover link provisório). Depende de Conan entregar links/PDFs.

Status: ready-for-agent

- [ ] Arquivos colocados em `public/certificates/<id>.<ext>` e referenciados em `file`
- [ ] Links reais em `url`; itens sem comprovante sem `url`/`file`
- [ ] Checagem manual: link abre em nova aba, arquivo abre, item sem comprovante sem botão
- [ ] Itens concluídos marcados no `TODO.md`
- [ ] Verificação sem testes automáticos: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build`.
