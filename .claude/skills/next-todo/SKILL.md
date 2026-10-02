---
name: next-todo
description: Lê o TODO.md e devolve só as perguntas necessárias para corrigir os próximos itens pendentes.
disable-model-invocation: true
argument-hint: "[seção ou trecho do item]"
---

`TODO.md` (raiz do repo) é a lista de migração do site herdado de outro dev para o portfólio do Conan. Esta skill só **pergunta**: devolve o mínimo que o Conan precisa responder para os próximos itens poderem ser corrigidos. Não edita nada.

## Passos

1. **Escolher os itens.** Leia `TODO.md`. Com argumento (`$ARGUMENTS`), pegue os `- [ ]` cuja seção ou texto bata com ele. Sem argumento, pegue os próximos `- [ ]` na ordem do arquivo, pulando seções cujo título contém "Deixar para depois", até cobrir a primeira seção com pendências (máx. 5 itens). Se não sobrou nenhum pendente, diga isso e pare.

2. **Levantar o estado atual.** Para cada item, abra só o que ele cita (`data/site.json`, `messages/pt.json`, `src/...`, `public/...`) e confira o valor atual. Use isso para decidir o que já dá para corrigir sozinho e o que depende do Conan (bio, números, opiniões, links, decisões).

3. **Responder.** Em português, sem introdução, resumo, diagnóstico nem lista de mudanças. Formato:
   - Uma linha por item: `**<item curto>**` seguido das perguntas objetivas (uma frase cada, com o valor atual entre parênteses só se ajudar a responder).
   - Pergunte apenas o que bloqueia a correção. Se o item não depende do Conan, escreva `sem dúvidas` e nada mais.
   - Nunca invente conteúdo que dependa do Conan.

Termine aí. Os arquivos ficam intactos até o Conan responder e pedir a correção. Quando ele confirmar que um item está resolvido, marque-o `- [x]` no `TODO.md`.
