# Conan Torres

Site pessoal de Conan Torres (criador de conteúdo e educador). Next.js 15 (App Router), React 18, TypeScript, Tailwind, shadcn/ui, `next-intl` (apenas português).

## Rodando

Requer Node >= 22 e pnpm.

```bash
pnpm install
pnpm dev     # servidor de desenvolvimento
pnpm build   # build de produção (valida env via src/env.mjs)
pnpm check   # lint + formatação (Biome)
```

Defina `SKIP_ENV_VALIDATION=1` para pular a validação de env (usado em builds Docker).

## Onde editar

- Conteúdo (perfil, redes, vídeos, cursos, certificações): `data/site.json` e `data/certifications.json`
- Textos da interface: `messages/pt.json`
- Páginas e componentes: `src/app/[locale]/`
