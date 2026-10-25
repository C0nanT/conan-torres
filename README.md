# Conan Torres

Site pessoal de **Conan Torres**, Tech Lead e Desenvolvedor Full Stack na Defensoria Pública de Santa Catarina. Reúne trajetória, experiência, projetos, certificações, livros e canais recomendados.

🌐 **[conantorres.dev](https://conantorres.dev)**

![Pré-visualização do site](public/og-image.png)

## Sobre o projeto

- Conteúdo 100% orientado a dados: perfil, experiência, recomendações, projetos e livros vêm de `data/site.json`, sem texto fixo nos componentes.
- Interface em português (`next-intl`, sem prefixo de locale na URL).
- Números do YouTube (views, inscritos, vídeos) atualizados automaticamente com cache de 24 h e fallback para os valores do JSON.
- SEO completo: metadata por página, JSON-LD, sitemap, robots e manifest.
- Animações com Framer Motion, respeitando `prefers-reduced-motion`.

## Stack

| Área | Tecnologias |
| --- | --- |
| Framework | Next.js 15 (App Router), React 18, TypeScript |
| UI | Tailwind CSS 3, shadcn/ui (new-york), Radix UI, Framer Motion |
| i18n | next-intl |
| Qualidade | Biome, Husky + lint-staged |
| Deploy | Docker Compose em VPS própria |

## Rodando localmente

Requer Node >= 22 e pnpm.

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção (saída `standalone`) |
| `pnpm check` | Lint + formatação (Biome) |
| `pnpm check:fix` | Corrige lint e formatação automaticamente |
| `pnpm typecheck` | Checagem de tipos |

O build usa `output: 'standalone'`, então `pnpm start` (`next start`) não é suportado: o Next avisa que não funciona com essa configuração. Em produção o site roda via Docker (veja [Deploy](#deploy)). Para testar o build de produção localmente:

```bash
pnpm build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
PORT=3000 node .next/standalone/server.js
```

## Estrutura

```
data/                 Conteúdo do site (site.json, certifications.json)
messages/pt.json      Textos da interface
public/               Imagens, certificados, capas de livros
src/app/[locale]/     Páginas (home, about, projects, books, certificates)
src/components/       ui (shadcn + animados), layout, common
src/lib/              site-data, metadata, navigation, youtube-live-stats
```

## Onde editar

- **Conteúdo** (perfil, redes, vídeos, projetos, livros, experiência): `data/site.json`. Ao criar um campo novo, atualize também o tipo `SiteData` em `src/lib/site-data.ts`.
- **Certificações**: `data/certifications.json` e arquivos em `public/certificates/`.
- **Textos da interface**: `messages/pt.json`.
- **Páginas e componentes**: `src/app/[locale]/`, com componentes específicos em pastas `_components/`.

## Deploy

Roda em VPS própria via Docker Compose (serviço `web`, build pelo `Dockerfile`, porta 8080). O site não precisa de variáveis de ambiente.

```bash
docker compose up -d --build
docker compose logs web | grep youtube-stats   # falhas e recuperações do scraping
```

O cache dos números do YouTube vive em `.next/cache` dentro da imagem, então cada rebuild o reinicia. O build faz o primeiro scrape e a primeira requisição após cada janela de 24 h o renova.

## Convenções

Código em TypeScript estrito, formatado pelo Biome (aspas simples, sem ponto e vírgula, 2 espaços). Arquivos em kebab-case, Server Components por padrão e `'use client'` só onde necessário. Detalhes em `AGENTS.md`.

## Licença

[MIT](LICENSE). O conteúdo pessoal (textos, fotos, recomendações em `data/` e `public/`) não está coberto por essa licença.

## Contato

- LinkedIn: [conan-torres](https://www.linkedin.com/in/conan-torres/)
- GitHub: [@C0nanT](https://github.com/C0nanT)
- E-mail: conantorreswf@gmail.com
