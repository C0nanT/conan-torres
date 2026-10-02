---
name: next-todo
description: Mostra o próximo item pendente do TODO.md e o que corrigir nele.
disable-model-invocation: true
argument-hint: "[seção ou trecho do item]"
---

`TODO.md` (raiz do repo) é a lista de migração do site herdado de outro dev para o portfólio do Conan. Esta skill é um **briefing**: diagnostica um item e diz o que mudar; quem decide e edita é o Conan.

## Passos

1. **Escolher o item.** Leia `TODO.md`. Com argumento (`$ARGUMENTS`), pegue o primeiro `- [ ]` cuja seção ou texto bata com ele. Sem argumento, pegue o primeiro `- [ ]` na ordem do arquivo, pulando seções cujo título contém "Deixar para depois". Feito quando há exatamente um item escolhido; se não sobrou nenhum pendente, diga isso e pare.

2. **Levantar o estado atual.** Abra cada arquivo, campo e componente que o item cita (`data/site.json`, `messages/pt.json`, `src/...`, `public/...`) e siga os usos com grep: quem lê o campo, onde o texto aparece na UI, se a rota/página existe. Feito quando cada referência do item tem o valor atual citado com `arquivo:linha`, ou está confirmada como inexistente.

3. **Briefing.** Responda em português, curto:
   - **Item**: o texto do TODO e a seção.
   - **Hoje**: o que está lá agora (valores reais, `arquivo:linha`), marcando o que é do dev anterior.
   - **O que corrigir**: lista concreta de mudanças por arquivo/campo. Onde o conteúdo depende do Conan (bio, números, opiniões, links), faça perguntas objetivas em vez de inventar.
   - **Cuidados**: efeitos colaterais (ex.: campo novo em `site.json` exige atualizar `SiteData` em `src/lib/site-data.ts`; imagem remota exige `remotePatterns`).

Termine o briefing aí: os arquivos ficam intactos até o Conan pedir a correção. Quando ele confirmar que o item está resolvido, marque-o `- [x]` no `TODO.md`.
