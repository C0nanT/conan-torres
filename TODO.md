# TODO — personalizar o site (herdado de Augusto Galego)

Conteúdo em `data/site.json` (e `messages/pt.json`).

- [ ] Melhorar os hovers do projeto

## Analytics (Deixar para depois)
- [ ] `site.analytics.clarityId` está vazio (Clarity desligado). Criar projeto no Microsoft Clarity e colocar o ID.

## Livros recomendados
- [ ] Preencher em `data/site.json`, por livro: `progress` (0-100, só para quem está `reading`), `rating` (1-5) e `note` (observação pessoal). Os campos são opcionais e só aparecem quando preenchidos.
- [ ] Capas reais dos livros (hoje a capa é um bloco em gradiente).

## Sobre mim (Fazer depois)
- [ ] Revisar a página completa de "sobre mim".

## Projetos (Fazer depois)
- [ ] Criar a página de projetos.

## Certificações (`data/certifications.json`)
Faltam `origamid-html-e-css-para-iniciantes` e `curso-em-video-python-3-mundo-3` (sem comprovante: botão não aparece).

- [ ] Para cada item: colocar o arquivo (PDF/imagem) em `public/certificates/` e/ou o link "Exibir credencial" do Linkedin, e adicionar ao JSON os campos `file` (ex.: `/certificates/anthropic-claude-code-in-action.pdf`) e `url` (link de verificação).
