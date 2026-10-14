# Seção de recomendações na home

Status: ready-for-agent

## Problem Statement

Conan tem recomendações escritas por outras pessoas no LinkedIn, mas a home não mostra nenhuma. O visitante não vê prova social de colegas e alunos, só a lista de experiências e depois os vídeos recomendados.

## Solution

Uma seção "Recomendações" na página inicial, entre as experiências e os vídeos do YouTube. Mostra depoimentos de quem recomendou Conan no LinkedIn (autor, cargo, relação, data e texto), com link para o perfil dele no LinkedIn. O conteúdo é copiado manualmente pelo Conan para o JSON de conteúdo: o LinkedIn não tem API pública para recomendações e bloqueia scraping (login wall), então não há busca automática. A seção continua visualmente contínua com as vizinhas, respeitando a lógica de gradiente de fundo.

## User Stories

1. Como visitante, quero ver recomendações de outras pessoas sobre Conan, para confiar no trabalho dele.
2. Como visitante, quero ver nome, cargo e relação (ex.: "trabalhamos juntos") de cada autor, para avaliar a credibilidade do depoimento.
3. Como visitante, quero ver a data de cada recomendação, para saber se é atual.
4. Como visitante, quero ler o texto completo de cada recomendação, para entender o contexto sem sair do site.
5. Como visitante, quero que textos longos fiquem legíveis (truncados com "ler mais" ou equivalente acessível), para não ter um paredão de texto.
6. Como visitante, quero um link "Ver todas no LinkedIn" para o perfil de Conan, para conferir a fonte original.
7. Como visitante, quero abrir o perfil do autor no LinkedIn em nova aba quando existir, para verificar quem é.
8. Como visitante, quero que a seção apareça abaixo das experiências e acima dos vídeos, para seguir a narrativa da página.
9. Como visitante, quero que o fundo da seção emende sem corte visível com Experiência e YouTube, para a página parecer um fluxo único.
10. Como visitante em celular, quero os depoimentos empilhados e legíveis em tela estreita, para ler em qualquer dispositivo.
11. Como visitante com teclado ou leitor de tela, quero links com foco visível e texto descritivo, para navegar sem mouse.
12. Como visitante com `prefers-reduced-motion`, quero animações de entrada desativadas, para não ter desconforto.
13. Como visitante com tema escuro, quero contraste correto dos cards e do fundo, para ler bem.
14. Como Conan, quero editar as recomendações só no JSON de conteúdo, para atualizar sem mexer em componentes.
15. Como Conan, quero que a seção não apareça se a lista estiver vazia, para não exibir bloco vazio.
16. Como Conan, quero que autor sem link de perfil seja exibido sem link, para não ter link quebrado.
17. Como Conan, quero que a ordem seja a do JSON, para eu escolher quais destacar primeiro.
18. Como buscador/crawler, quero o texto das recomendações no HTML renderizado no servidor, para ser indexável.

## Implementation Decisions

- Dados: nova lista `recommendations` no JSON de conteúdo do site, com campos por item: id, nome do autor, cargo/empresa do autor, relação com Conan, data (texto exibível), texto, URL opcional do perfil do autor. O tipo `SiteData` é atualizado junto (o JSON é só cast). Link "ver todas" reutiliza a URL do LinkedIn já presente nos links sociais.
- Sem busca automática do LinkedIn. Decisão do Conan: copiar manualmente. Registrar isso no cabeçalho da seção de dados/TODO para o próximo a atualizar.
- Componente de seção novo na pasta de componentes da home, exportado pelo barrel, Server Component. Textos fixos de UI (título, subtítulo, "ver todas no LinkedIn") vão para o namespace de mensagens em português, conforme convenção; sem hardcode como no bloco do YouTube se possível.
- Posição: após `ExperienceSection`, antes do divisor e do `YouTubeChannels`.
- Fundo (ponto crítico): Experiência termina em gradiente vertical de `background` para `muted/30`; divisor e YouTube usam `muted/30` chapado. A nova seção deve começar em `muted/30` chapado (sem novo gradiente de entrada) para emendar sem faixa com o fim da Experiência. Entre Recomendações e YouTube mantém-se o divisor pontilhado existente (ambos `muted/30`). Opcionalmente um divisor também entre Experiência e Recomendações, já que ambos terminam/iniciam no mesmo tom. Cards usam `background`/`card` para destacar sobre `muted/30`. Validar claro e escuro.
- Estilo consistente com YouTube: badge, título com `gradient-text` na palavra de destaque, subtítulo, largura `max-w-6xl`.
- Layout: grade de cards (1 coluna mobile, 2 colunas desktop); sem carrossel para evitar JS e problemas de a11y.
- Animação, se houver, só `transform`/`opacity` e desligada com `prefers-reduced-motion`.
- Seção retorna nulo quando a lista está vazia.
- Seguir SOLID no escopo da mudança: a seção só renderiza dados recebidos; dados vêm de `site-data`. Não refatorar seções vizinhas.

## Testing Decisions

- Sem testes automatizados (regra do projeto). Verificação: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build` e checagem manual.
- Bom teste = comportamento externo observável na página renderizada, não detalhes de implementação.
- Seam único acordado: a home `/` renderizada. Conferir: seção entre Experiência e YouTube; fundo sem corte visível nas duas transições (claro e escuro); mobile e desktop; seção ausente com lista vazia; links externos com `rel="noopener noreferrer"`.
- Prior art: specs de projetos e certificações usam a mesma abordagem manual.

## Out of Scope

- Busca automática, scraping ou API paga do LinkedIn.
- Página dedicada de recomendações.
- Recomendações dadas por Conan a terceiros.
- Carrossel, filtros ou busca.
- Revisar a página "Sobre" e demais itens do TODO.
- Reescrever o fundo das seções vizinhas além do necessário para emendar.

## Further Notes

- Conan precisa fornecer o texto das recomendações (copiar do LinkedIn, com permissão implícita de exibir; avaliar pedir ok dos autores).
- Texto de recomendação é conteúdo de terceiros: exibir fielmente, sem editar.
- Ao concluir, marcar o item no TODO.md.
