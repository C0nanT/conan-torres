# Limpeza de herança do projeto anterior

Status: ready-for-agent

## Problem Statement

O repositório ainda carrega resquícios do site de Augusto Galego: um relatório de bugs que cita `augustogalego` e rotas `/blog/...` inexistentes, um README com boilerplate T3, `remotePatterns` possivelmente sem uso e metadados de `package.json` não conferidos. Isso confunde quem abre o repo e pode vazar identidade errada.

## Solution

Remover ou reescrever cada resquício para refletir o projeto real de Conan Torres, sem mexer em comportamento do site.

## User Stories

1. Como Conan, quero apagar o relatório de bugs do site antigo, para não ter documentação enganosa no repo.
2. Como visitante do repo no GitHub, quero um README que descreva este site, para entender o projeto e rodá-lo.
3. Como desenvolvedor, quero rodar o projeto seguindo o README (pnpm, Node >= 22, `SKIP_ENV_VALIDATION`), para começar rápido.
4. Como Conan, quero que `package.json` tenha nome, autor e repositório corretos, para a identidade do pacote bater com o GitHub.
5. Como Conan, quero que o remote `origin` aponte para o repo certo, para não dar push no lugar errado.
6. Como Conan, quero `remotePatterns` com só os domínios realmente usados, para não permitir imagens de hosts desnecessários.
7. Como Conan, quero que o bug conhecido do formulário de contato fique registrado num lugar atual (não no relatório antigo), para não perdê-lo.

## Implementation Decisions

- `REMAINING_ISSUES_REPORT.md`: pertence ao site antigo. **Suposição**: apagar. Antes de apagar, mover o único item ainda relevante (form de contato não funcional) para um ticket em `.scratch/` e atualizar a menção no `AGENTS.md`.
- `README.md`: reescrever curto em pt: o que é, stack, comandos (`pnpm dev/build/check`), onde ficam conteúdo (`data/site.json`) e textos (`messages/pt.json`). Remover boilerplate T3.
- `package.json`: definir `author` (Conan Torres) e `repository` (`https://github.com/C0nanT/conan-torres`); `name` já é `conan-torres`, manter.
- Remote `origin` já é `C0nanT/conan-torres`: apenas confirmar, nada a mudar. Não executar git destrutivo (guardrails).
- `remotePatterns` em `next.config.mjs`: `img.youtube.com` é usado. Amazon (`images-na.ssl-images-amazon.com`, `m.media-amazon.com`) aparece só como links de livros em `data/site.json`, não como imagens; `ghchart.rshah.org` não aparece em `src`. Antes de remover, buscar uso real de `next/image` com esses hosts (incluindo capas de livros e gráfico GitHub). Remover os hosts sem uso; se capas de livros ainda forem renderizadas, manter Amazon.

## Testing Decisions

Sem testes automáticos (ver AGENTS.md). Seam acordado: nenhum automatizado. Verificação: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build` (quebra se alguma imagem usar host removido em runtime? build não pega tudo, então checar manualmente home e `/about`).

## Out of Scope

- Reformar páginas, trocar stack, mexer em CI/Docker.
- Corrigir o form de contato (só registrar).

## Further Notes

Ordem sugerida: package.json → README → remotePatterns → relatório. Cada um é independente.
