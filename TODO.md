# TODO — personalizar o site (herdado de Augusto Galego)

Conteúdo em `data/site.json` (e `messages/pt.json`). Feito: nome, email, domínio, GitHub.

## Analytics
- [ ] `site.analytics.clarityId` está vazio (Clarity desligado). Criar projeto no Microsoft Clarity e colocar o ID.

## Redes sociais (`social.*` em `data/site.json`)
- [x] YouTube (`youtube`, `youtubeSecondary`): ainda com handle do Augusto (`@GutoGalego`, `@GutoMonólogos`) e URL placeholder `todo.com`. Remover ou trocar.
- [x] X/Twitter (`twitter`): sem conta, handle vazio e URL placeholder. Remover do footer (`src/components/layout/footer.tsx`), `getSocialLinksForNav` e `getSocialSameAs` (`src/lib/site-data.ts`), e `twitter.site/creator` em `src/lib/metadata.ts`.
- [x] LinkedIn: URL ainda placeholder (handle `conan-torres`).
- [x] `src/app/[locale]/layout.tsx:140-141`: remover `dns-prefetch` de youtube/twitter se tirar as redes.
- [x] Hero (`hero-section.tsx`): botão/seção "Canais no YouTube" usa `social.youtube.url`.

## YouTube (`youtube.*`)
- [x] `channels` (principal/secundário): são os canais do Augusto (135K inscritos, 226 vídeos…). Remover a seção ou trocar.
- [x] `freeLessonVideoId` (`g-hIXvdDeZk`): vídeo de aula grátis dele, usado em `featured-content.tsx`.
- [x] `recommendedChannels` / `recommendedVideos`: curadoria dele (Matt Pocock, Karpathy, Renato Augusto). Manter só se for sua recomendação; URLs ainda `todo.com`.

## Cursos (`courses.*`)
- [x] `featured` (LeetCode, 68 aulas, 5k+ alunos, 8h) e `others` (Roadmap, workshops LeetCode e System Design): cursos dele. Trocar por projetos seus ou remover. URLs `todo.com`.
- [x] Footer usa `courses.others[0].url`; hero usa `courses.featured.url`.
- [x] `messages/pt.json` → `metadata.courses` (título/descrição/keywords "saiu do Brasil e chegou ao topo na Europa e EUA").

## Bio / About (`about.*` e `philosophy.*`)
- [ ] `about`: headline "De júnior no Brasil a CTO nos EUA", bio (UFSC 2014, CTO de startup americana, Itália), `quickFacts` (Pádua, CTO, 2014-2025), `achievements` (135K seguidores, palestrante…).
- [ ] `philosophy.coreValues` e `personalInsights`: opiniões dele (LeetCode, carreira internacional, Notion, educação online).
- [ ] `content.hero.highlights` e `profile.*`: revisar (role, subtitle, education UNIASSELVI, 6+ anos) — conferir se está tudo certo.

## Stats do hero
- [ ] `hero-section.tsx` lê `profile.stats.youtubeSubscribers`, `courseLessons`, `countriesWorked`, mas `profile.stats` só tem `yearsExperience`. Trocar os cards (inscritos YouTube, aulas, países) por números seus.
- [ ] `messages/pt.json` → `hero.stats` e `hero.cta` ("Disponível para mentorias", "Ler Blog" sem blog?). `contact.availability` também.

## SEO
- [ ] `seo.keywords` em `data/site.json` e `metadata.home/about.keywords` em `messages/pt.json`: tudo de algoritmos/LeetCode/CTO/Europa/emigração. Trocar por cibersegurança, full-stack, etc.
- [ ] `messages/pt.json` → `metadata.books/setup`: textos genéricos, revisar.

## Livros e setup (`messages/pt.json`)
- [ ] Comentários dos livros ("Um dos livros que mais influenciou minha forma de pensar"…) estão na voz dele. Reescrever com suas opiniões ou remover. Conferir se as páginas existem (`src/app/[locale]` só tem `about` e home).
- [ ] `setup` / ícones `public/icons` (claude, cursor): conferir se refletem seu setup.

## Imagens / assets
- [ ] `public/profile-id-sem-fundo-2.png` e favicons/android-chrome/apple-touch: conferir se são suas (e OG image).

## Outros
- [ ] `REMAINING_ISSUES_REPORT.md`: relatório de bugs do site dele (cita `augustogalego`, rota `/blog/...`, form de contato não funcional). Revisar/apagar.
- [ ] `README.md` é boilerplate T3.
- [ ] `next.config.mjs` `remotePatterns` (Amazon, ghchart): ver se ainda usa.
- [ ] `package.json` (name, repository, author) e `.git` remotes: conferir.
