# TODO — personalizar o site (herdado de Augusto Galego)

Conteúdo em `data/site.json` (e `messages/pt.json`). Feito: nome, email, domínio, GitHub.

- [ ] Melhorar os hovers do projeto

## Analytics (Deixar para depois)
- [ ] `site.analytics.clarityId` está vazio (Clarity desligado). Criar projeto no Microsoft Clarity e colocar o ID.

## Livros recomendados
Página `/books` criada (cards em lista horizontal, variante B). Status e capa em gradiente já funcionam.

- [ ] Preencher em `data/site.json`, por livro: `progress` (0-100, só para quem está `reading`), `rating` (1-5) e `note` (observação pessoal). Os campos são opcionais e só aparecem quando preenchidos.
- [ ] Capas reais dos livros (hoje a capa é um bloco em gradiente).

## Footer (Fazer depois)
- [ ] Arrumar a bandeira do Brasil, que está torta.
- [ ] Trocar o texto "comunidade" por algo melhor.
- [ ] Colocar o Instagram e o email no footer.

## Sobre mim (Fazer depois)
- [ ] Revisar a página completa de "sobre mim".

## Projetos (Fazer depois)
- [ ] Criar a página de projetos.

## WhatsApp
- [x] Colocar um botão flutuante de WhatsApp no canto da tela.

## Certificações (`data/certifications.json`)
Os 25 itens e a página `/certificates` já existem. 23 de 25 já têm `url` real. Faltam `origamid-html-e-css-para-iniciantes` e `curso-em-video-python-3-mundo-3` (sem comprovante: botão não aparece).

- [ ] Para cada item: colocar o arquivo (PDF/imagem) em `public/certificates/` e/ou o link "Exibir credencial" do LinkedIn, e adicionar ao JSON os campos `file` (ex.: `/certificates/anthropic-claude-code-in-action.pdf`) e `url` (link de verificação).
