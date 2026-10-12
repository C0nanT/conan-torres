# Página de certificações (`/certificates`)

Status: ready-for-agent

## Problem Statement

O hero mostra o número de certificações (25), mas o visitante não consegue ver quais são nem verificar nenhuma delas. Os dados já existem em `data/certifications.json` (com `id` e tipo `Certification` exportado em `site-data.ts`), mas nada os exibe. Conan quer provar as certificações sem expor links quebrados enquanto ainda não reuniu todos os comprovantes.

## Solution

Uma página `/certificates` que lista todas as certificações. Cada item mostra título, emissor, data e competências. Se o item tiver um comprovante (arquivo) ou link de credencial, o título/ação abre em nova aba; se tiver os dois, o link de credencial é o principal e o arquivo fica como segunda ação. Se não tiver nenhum, o item aparece sem link. O card "Certificações" do hero passa a levar a essa página.

## User Stories

1. Como visitante, quero ver a lista de certificações de Conan, para avaliar a formação dele além do número no hero.
2. Como visitante, quero ver emissor e data de cada certificação, para saber a origem e a atualidade.
3. Como visitante, quero ver as competências associadas a cada certificação, para entender o que foi coberto.
4. Como visitante, quero que a lista venha da mais recente para a mais antiga, para ver primeiro o que é atual.
5. Como visitante, quero abrir o comprovante ou a credencial em nova aba, para verificar a certificação sem perder a página.
6. Como visitante, quero que certificações sem comprovante não mostrem link, para não clicar em algo que não leva a lugar nenhum.
7. Como visitante, quero chegar à página clicando no card "Certificações" do hero, para descobrir a lista de forma natural.
8. Como visitante em celular, quero a lista legível em tela estreita, para consultar de qualquer dispositivo.
9. Como visitante que usa teclado ou leitor de tela, quero links com foco visível e texto descritivo, para navegar sem mouse.
10. Como visitante com `prefers-reduced-motion`, quero que animações de entrada sejam desativadas, para não ter desconforto.
11. Como buscador/crawler, quero metadata e entrada no sitemap para a página, para que ela seja indexada com título e descrição próprios.
12. Como Conan, quero adicionar um comprovante apenas preenchendo `file` ou `url` no JSON, para a página se atualizar sem mudar código.
13. Como Conan, quero que o número do hero continue vindo de `profile.stats.certifications`, para decidir à parte o que conta.

## Implementation Decisions

- Nova rota `certificates` sob `[locale]`, seguindo o padrão da página `about`: server component, `generateMetadata` via `generateLocalizedMetadata(locale, 'certificates')`, componentes colocados em `_components/` com barrel `index.ts`.
- Fonte de dados: o array `certifications` exportado por `site-data.ts`. Nenhuma mudança de schema; `file` e `url` já são opcionais no tipo.
- Ordenação: por `issuedAt` decrescente (formato `YYYY-MM`, ordena como string). Empates mantêm a ordem do JSON.
- Regra de link, isolada numa função pequena e pura que recebe uma `Certification` e devolve os destinos disponíveis (credencial `url`, arquivo `file`, ou nenhum). A UI só renderiza o que essa função devolve (SRP: regra de link separada da apresentação).
- Links externos: `target="_blank"` e `rel="noopener noreferrer"`. Arquivos em `public/certificates/` abrem direto.
- Textos da UI em um novo namespace `certificates` em `messages/pt.json` (título, descrição, rótulos "Ver credencial" / "Ver comprovante", vazio). Namespace `metadata.certificates` com `title`, `description` e `keywords`, exigido por `generateLocalizedMetadata`.
- Formatação de data (`YYYY-MM` -> "mai. 2026") em pt-BR, com `Intl.DateTimeFormat`, sem biblioteca nova.
- Componentes de UI existentes (cards, badges de shadcn) são reutilizados; sem estilos novos globais. Animações só com transform/opacity e respeitando `prefers-reduced-motion`.
- Hero: o card "Certificações" ganha `href: '/certificates'` no mesmo mecanismo do card de projetos, usando o `Link` de `@/lib/navigation`.
- Sitemap: adicionar `/certificates` ao `sitemap.ts`.
- Navegação principal não muda (a página é alcançada pelo hero e pelo sitemap).
- `credentialId` não é exibido por padrão; fica no JSON para futura verificação.

## Testing Decisions

- Sem testes automatizados nesta entrega, por decisão do usuário (o projeto também não tem framework de testes).
- Seams acordados: nenhum.
- Verificação: `pnpm check`, `pnpm exec tsc --noEmit` e `pnpm build` limpos, mais conferência manual em dev: lista completa (25 itens), item sem link sem âncora, item com `url`/`file` abrindo em nova aba, card do hero levando à página, layout em tela estreita.

## Out of Scope

- Coletar os comprovantes e links das 25 certificações (trabalho de Conan, rastreado no `TODO.md`).
- Decidir quais itens contam no número do hero e atualizar `profile.stats.certifications`.
- Conferir `profile.education` com a graduação.
- Filtros, busca ou agrupamento por emissor.
- Versão em inglês (o site é só pt).
- Item no menu de navegação principal.

## Further Notes

- Enquanto nenhum item tiver `file` ou `url`, a página mostra a lista sem nenhum link; isso é intencional.
- O item "Palestrante" e a graduação são tratados como certificações comuns na lista.
