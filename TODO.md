# TODO — personalizar o site (herdado de Augusto Galego)

Conteúdo em `data/site.json` (e `messages/pt.json`). Feito: nome, email, domínio, GitHub.

## Analytics (Deixar para depois)
- [ ] `site.analytics.clarityId` está vazio (Clarity desligado). Criar projeto no Microsoft Clarity e colocar o ID.

## Bio / About (`about.*` e `philosophy.*`)
- [x] `about`: headline "De júnior no Brasil a CTO nos EUA", bio (UFSC 2014, CTO de startup americana, Itália), `quickFacts` (Pádua, CTO, 2014-2025), `achievements` (135K seguidores, palestrante…).
- [x] `philosophy.coreValues` e `personalInsights`: opiniões dele (LeetCode, carreira internacional, Notion, educação online).
- [x] `content.hero.highlights` e `profile.*`: revisar (role, subtitle, education UNIASSELVI, 6+ anos) — conferir se está tudo certo.

## Stats do hero
- [ ] `hero-section.tsx` lê `profile.stats.youtubeSubscribers`, `courseLessons`, `countriesWorked`, mas `profile.stats` só tem `yearsExperience`. Trocar os cards (inscritos YouTube, aulas, países) por números seus.
- [ ] `messages/pt.json` → `hero.stats` e `hero.cta` ("Disponível para mentorias", "Ler Blog" sem blog?). `contact.availability` também.

## SEO
- [x] `seo.keywords` em `data/site.json` e `metadata.home/about.keywords` em `messages/pt.json`: tudo de algoritmos/LeetCode/CTO/Europa/emigração. Trocar por cibersegurança, full-stack, etc.
- [ ] `messages/pt.json` → `metadata.books/setup`: textos genéricos, revisar.

## Livros e setup (`messages/pt.json`)
- [ ] Comentários dos livros ("Um dos livros que mais influenciou minha forma de pensar"…) estão na voz dele. Reescrever com suas opiniões ou remover. Conferir se as páginas existem (`src/app/[locale]` só tem `about` e home).
- [ ] `setup` / ícones `public/icons` (claude, cursor): conferir se refletem seu setup.

## Imagens / assets
- [ ] `public/profile-id-sem-fundo-2.png` e favicons/android-chrome/apple-touch: conferir se são suas (e OG image).
## Certificações (`data/certifications.json`)
Os 25 itens já estão no JSON (título, emissor, mês, código, competências). Falta anexar o comprovante e o link de cada um para a página `/certificates` (ainda não existe).

- [ ] Para cada item: colocar o arquivo (PDF/imagem) em `public/certificates/` e/ou o link "Exibir credencial" do LinkedIn, e adicionar ao JSON os campos `file` (ex.: `/certificates/anthropic-claude-code-in-action.pdf`) e `url` (link de verificação).
- [ ] Adicionar `id` (slug) a cada certificação e o tipo `Certification` em `src/lib/site-data.ts` (o JSON é só cast).
- [ ] Criar a página `src/app/[locale]/certificates/` listando as certificações: clicar abre o arquivo ou o link da credencial (`target="_blank"`, `rel="noopener noreferrer"`) e, se não houver os dois, não mostrar link.
- [ ] Ligar o card "Certificações" do hero a `/certificates` (campo `href` em `hero-section.tsx`, como o card de projetos).
- [ ] Decidir se palestra, graduação (UNIASSELVI) e teste de inglês (EF SET) contam no número do hero (hoje 25; só cursos = 22 ou 23). Se mudar, atualizar `profile.stats.certifications`.
- [ ] `profile.education` em `data/site.json`: conferir com a graduação UNIASSELVI (ADS, jul. 2025).

Comprovantes por certificação (arquivo e/ou link):
- [ ] Palestrante: 1° Encontro de Tecnologia das Defensorias Públicas da Região Sul — Defensoria Pública do Estado do Rio Grande do Sul (ago. 2026)
- [ ] AI Fluency: Framework & Foundations — Anthropic (mai. 2026)
- [ ] Claude Code In Action — Anthropic (mai. 2026)
- [ ] Curso de Banco de dados relacionais e SQL — Full Cycle (dez. 2025)
- [ ] Curso de Fundamentos de Cloud Computing (AWS) — Full Cycle (dez. 2025)
- [ ] Curso de Docker para produção — Full Cycle (dez. 2025)
- [ ] EF SET English Certificate 50/100 (B1 Intermediate) — EF SET (nov. 2025)
- [ ] Curso de POO - Orientação a objetos — Full Cycle (nov. 2025)
- [ ] Análise e Desenvolvimento de Sistemas — UNIASSELVI (jul. 2025)
- [ ] Curso de Git e Github — Full Cycle (jul. 2025)
- [ ] Curso de Arquitetura em camadas e MVC — Full Cycle (jul. 2025)
- [ ] Curso de Autenticação e autorização: Tokens JWT, ACL e RBAC — Full Cycle (jun. 2025)
- [ ] Curso de SOLID na prática - Princípios e aplicações em design de software — Full Cycle (mai. 2025)
- [ ] Curso de Docker para Desenvolvimento — Full Cycle (abr. 2025)
- [ ] Curso de Docker na prática — Full Cycle (abr. 2025)
- [ ] Curso de REST e Níveis de Maturidade na prática — Full Cycle (mar. 2025)
- [ ] React Native: utilizando e criando Hooks — Alura (abr. 2024)
- [ ] Laravel: validando formulários, usando sessões e definindo relacionamentos — Alura (mar. 2024)
- [ ] Laravel: criando uma aplicação com MVC — Alura (fev. 2024)
- [ ] Formação Aprenda a programar em PHP - 8 Cursos — Alura (fev. 2024)
- [ ] Git e GitHub: repositório, commit e versões — Alura (set. 2023)
- [ ] SQL com MySQL: manipule e consulte dados — Alura (set. 2023)
- [ ] Modelagem de banco de dados relacional: entidades, relacionamentos e atributos — Alura (set. 2023)
- [ ] HTML e CSS para Iniciantes — Origamid (jul. 2023)
- [ ] Python 3 - Mundo 3 — Curso em Vídeo (jan. 2023)

## Outros
- [ ] `REMAINING_ISSUES_REPORT.md`: relatório de bugs do site dele (cita `augustogalego`, rota `/blog/...`, form de contato não funcional). Revisar/apagar.
- [ ] `README.md` é boilerplate T3.
- [ ] `next.config.mjs` `remotePatterns` (Amazon, ghchart): ver se ainda usa.
- [ ] `package.json` (name, repository, author) e `.git` remotes: conferir.
