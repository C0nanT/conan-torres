# Página de projetos (`/projects`)

Status: ready-for-agent

## Problem Statement

A navegação já tem o link "Projetos" apontando para `/projects`, mas a página não existe e o visitante cai em 404. O hero mostra um número de "Projetos Relevantes Publicados" digitado à mão, sem que o visitante possa ver quais são. Os repositórios do GitHub de Conan já estão em `data/github-repos.json` (com um campo `featured`), mas nada no site os usa, e muitos têm `description: null`. Conan quer uma vitrine para recrutadores e outros devs, sem expor um inventário bruto do GitHub.

## Solution

Uma página `/projects` com uma grade de cards, um por projeto em destaque. Cada card mostra nome, descrição em português, linguagem principal, tags da stack, link de código (GitHub), link de demo (só se existir) e uma imagem opcional. A lista combina dois dados: o GitHub (nome, linguagem, URL, homepage) e o `site.json` (texto em português, stack, imagem), ligados pelo nome do repositório. Só entram projetos escolhidos por Conan, na ordem em que ele os escrever. O número de projetos do hero passa a ser calculado dessa lista.

## User Stories

1. Como visitante, quero abrir `/projects` pela navegação sem cair em 404, para conhecer o trabalho de Conan.
2. Como recrutador, quero ver o que cada projeto é em uma ou duas frases em português, para avaliar rápido sem abrir o repositório.
3. Como dev, quero ver a linguagem principal e a stack de cada projeto, para entender as tecnologias usadas.
4. Como dev, quero um link "Código" que leve ao repositório no GitHub, para ler o código-fonte.
5. Como visitante, quero um link "Demo" quando o projeto tiver site publicado, para ver o resultado funcionando.
6. Como visitante, quero que projetos sem demo não mostrem link "Demo", para não clicar em algo que não leva a lugar nenhum.
7. Como visitante, quero que os links externos abram em nova aba, para não perder a página.
8. Como visitante, quero ver só os projetos que Conan escolheu mostrar, para não me perder entre forks e repositórios de teste.
9. Como visitante, quero que o primeiro projeto da lista seja o que Conan considera mais importante, para ver o melhor trabalho primeiro.
10. Como visitante, quero ver uma imagem do projeto quando houver, para entender visualmente o que ele é.
11. Como visitante, quero que projetos sem imagem tenham um fundo padrão (com a linguagem ou um ícone), para a grade ficar uniforme.
12. Como visitante no desktop, quero os cards em 2 colunas, para ver vários projetos de uma vez.
13. Como visitante no celular, quero os cards em 1 coluna, para ler sem rolar para o lado.
14. Como visitante, quero um efeito discreto de elevação e realce de borda ao passar o mouse, para perceber que o card é interativo.
15. Como visitante com `prefers-reduced-motion`, quero que as animações do hover e de entrada sejam desativadas, para não ter desconforto.
16. Como visitante que usa teclado ou leitor de tela, quero links com foco visível e texto descritivo, para navegar sem mouse.
17. Como visitante, quero ver um título e subtítulo curtos no topo da página, para saber do que se trata.
18. Como buscador/crawler, quero metadata própria e entrada no sitemap, para que a página seja indexada com título e descrição próprios.
19. Como visitante, quero que o número de projetos do hero bata com a quantidade de cards, para confiar nos números do site.
20. Como Conan, quero adicionar um projeto escrevendo uma entrada em `site.json` com o nome do repo, para a página se atualizar sem mudar código.
21. Como Conan, quero que o build falhe com erro claro se eu digitar um nome de repo que não existe no `github-repos.json`, para não perder um projeto sem perceber.
22. Como Conan, quero atualizar o `github-repos.json` à mão, para o site continuar estático e sem depender da API do GitHub.
23. Como Conan, quero marcar os dois itens da página de projetos no `TODO.md` como feitos, para o TODO refletir o estado real.

## Implementation Decisions

- **Dois dados, ligados pelo nome do repositório.** O GitHub JSON fornece nome, linguagem, URL do repo e homepage (demo). O `site.json` ganha uma lista de projetos em destaque, na ordem de exibição, com: nome do repo, descrição em português, tags da stack e caminho opcional da imagem. A ordem da lista em `site.json` é a ordem na página.
- **Seleção.** Só entram projetos listados em `site.json`. O campo `featured` do GitHub JSON e a exclusão de forks servem de ponto de partida para escolher a primeira lista, não de filtro em tempo de execução. Na primeira versão, a lista começa com os repos hoje marcados `featured` (não-forks); a descrição em português fica como campo a ser preenchido por Conan.
- **Validação no build.** Como o JSON é só convertido para o tipo, a camada que junta os dois dados deve lançar um erro claro quando um nome de `site.json` não existir no GitHub JSON. A falha aparece em `pnpm build`.
- **Tipos.** Ao acrescentar campos em `site.json`, atualizar a interface `SiteData` (o JSON é cast, não validado). Seguir a mesma ideia do tipo `Certification` já exportado em `site-data.ts`.
- **Módulo de dados.** Um módulo em `src/lib` expõe a lista final de projetos já combinada (SRP: a página só renderiza, a junção e a validação ficam fora dela). A página e o hero consomem essa mesma lista.
- **Número do hero.** `profile.stats.relevantProjects` deixa de ser digitado à mão: o hero usa o tamanho da lista de projetos. Remover ou deixar de usar o campo antigo em `site.json` e no tipo.
- **Página.** Server Component em `src/app/[locale]/projects/`, com componentes em `_components/` e barrel `index.ts`, como nas outras páginas. Sem página interna por projeto e sem filtro ou busca.
- **Card.** Nome, descrição, linguagem, tags da stack, link "Código", link "Demo" (só se houver homepage), imagem opcional. Sem estrelas nem data de push. Imagens ficam em `public/projects/`, então não é preciso mexer em `images.remotePatterns`. Sem imagem, o card mostra um fundo padrão.
- **Hover.** Elevação leve com realce da borda, usando só `transform`/`opacity` (e cor da borda), interrompível e desativada com `prefers-reduced-motion`, conforme `.cursor/rules/animation-guidelines.mdc`. Isso cobre o item "Melhorar os hovers do projeto" do `TODO.md`.
- **Layout.** Grade de 1 coluna no celular e 2 no desktop. Seguir o padrão visual e de animação de entrada das páginas de livros e certificados.
- **Textos.** Título, subtítulo, rótulos dos links ("Código", "Demo") e metadata em `messages/pt.json`, nos namespaces já usados. Metadata via `generateLocalizedMetadata`. Nova entrada em `sitemap.ts`.
- **Navegação.** O link `/projects` já existe e usa o `Link` de `src/lib/navigation.ts`; não precisa mudar.
- **TODO.md.** Marcar "Criar a página de projetos" e "Melhorar os hovers do projeto" como feitos.

## Testing Decisions

Sem testes automatizados: este é um site de portfólio e o projeto não usa framework de testes (ver `AGENTS.md`). Por isso não há seams de teste a propor.

- Verificação: `pnpm check`, `pnpm exec tsc --noEmit` e `pnpm build`.
- Verificação manual: abrir `/projects` em desktop e celular; conferir links "Código" e "Demo", fundo padrão sem imagem, hover, foco por teclado e `prefers-reduced-motion`; confirmar que o número do hero bate com os cards; confirmar que um nome de repo inválido em `site.json` quebra o build com erro claro.

## Out of Scope

- Páginas internas por projeto (`/projects/nome`).
- Filtro por linguagem ou tag, e busca.
- Busca automática de dados na API do GitHub (o `github-repos.json` continua atualizado à mão).
- Estrelas, data de push e outras métricas do GitHub nos cards.
- Escrever as descrições em português dos projetos (conteúdo de Conan).
- Tradução para outros idiomas.
- Refatorar o restante do site além do fluxo desta página e do número do hero.

## Further Notes

- `data/github-repos.json` tem muitas descrições nulas, então o texto em português do `site.json` é obrigatório para cada projeto exibido.
- Se a lista passar de cerca de 10 projetos, vale reabrir a decisão de filtro.
- Ao terminar, avisar sobre qualquer módulo fora do fluxo que a regra de SOLID sugeriria mexer e que foi deixado como está.
