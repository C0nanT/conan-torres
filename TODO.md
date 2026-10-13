# TODO — personalizar o site (herdado de Augusto Galego)

Conteúdo em `data/site.json` (e `messages/pt.json`). Feito: nome, email, domínio, GitHub.

## Analytics (Deixar para depois)
- [ ] `site.analytics.clarityId` está vazio (Clarity desligado). Criar projeto no Microsoft Clarity e colocar o ID.

## Certificações (`data/certifications.json`)
Os 25 itens e a página `/certificates` já existem. Falta anexar o comprovante e o link de cada certificação.

- [ ] Para cada item: colocar o arquivo (PDF/imagem) em `public/certificates/` e/ou o link "Exibir credencial" do LinkedIn, e adicionar ao JSON os campos `file` (ex.: `/certificates/anthropic-claude-code-in-action.pdf`) e `url` (link de verificação).
- [ ] **Provisório:** as 25 certificações estão com `url: "https://www.google.com"` em `data/certifications.json` só para testar o botão de link do card. Trocar cada uma pelo link real da credencial (e/ou `file`); remover o `url` das que não tiverem comprovante, para o botão não aparecer.
