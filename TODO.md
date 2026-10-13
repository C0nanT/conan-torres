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

## WhatsApp (Fazer depois)
- [ ] Colocar um botão flutuante de WhatsApp no canto da tela.

## Certificações (`data/certifications.json`)
Os 25 itens e a página `/certificates` já existem. Falta anexar o comprovante e o link de cada certificação.

- [ ] Na página de certificados, trocar a cor da bolinha nos anos de preto para a cor da linha.
- [ ] Na página de certificados, trocar a linha por linha pontilhada, com gradiente no final dela (de cima para baixo) para acabar um pouco antes de chegar na próxima bolinha.

- [ ] Para cada item: colocar o arquivo (PDF/imagem) em `public/certificates/` e/ou o link "Exibir credencial" do LinkedIn, e adicionar ao JSON os campos `file` (ex.: `/certificates/anthropic-claude-code-in-action.pdf`) e `url` (link de verificação).
- [ ] **Provisório:** as 25 certificações estão com `url: "https://www.google.com"` em `data/certifications.json` só para testar o botão de link do card. Trocar cada uma pelo link real da credencial (e/ou `file`); remover o `url` das que não tiverem comprovante, para o botão não aparecer.
