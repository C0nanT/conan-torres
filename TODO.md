# TODO — personalizar o site (herdado de Augusto Galego)

Conteúdo em `data/site.json` (e `messages/pt.json`). Feito: nome, email, domínio, GitHub.

## Analytics (Deixar para depois)
- [ ] `site.analytics.clarityId` está vazio (Clarity desligado). Criar projeto no Microsoft Clarity e colocar o ID.

## Livros recomendados (Fazer depois)
Página de livros com os livros que recomendo.

- [ ] Criar a página de livros.
- [ ] Separar os livros por status: já lidos, lendo agora e vou ler.
- [ ] Indicar o progresso de cada livro com uma barrinha de progresso ou gradiente na capa: sem cor o que não li, com cor o que já li.
- [ ] Nota de 1 a 5 estrelas por livro.
- [ ] Pequena observação sobre cada livro.
- [ ] Conteúdo em `data/site.json` (atualizar o tipo `SiteData` em `src/lib/site-data.ts`) e textos de UI em `messages/pt.json`.

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
