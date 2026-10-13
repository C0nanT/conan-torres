# Comprovantes das certificações e dados relacionados

Status: ready-for-agent

## Problem Statement

A página `/certificates` já existe, mas os 25 itens usam um link provisório (`https://www.google.com`) só para testar o botão. Nenhum item tem comprovante real. O visitante que clica em "exibir credencial" cai numa página falsa, e Conan não decidiu o que entra no número "25" do hero nem conferiu o ano da graduação em `profile.education`.

## Solution

Cada certificação passa a ter só o que é real: link de verificação (`url`) e/ou arquivo (`file`) em `public/certificates/`. Itens sem nenhum dos dois ficam sem link (a página já esconde o botão). O link provisório é removido de todos. O número do hero e `profile.education` são conferidos e corrigidos.

## User Stories

1. Como visitante, quero que o botão de credencial leve à credencial real, para poder verificar a certificação.
2. Como visitante, quero abrir o PDF/imagem do certificado quando não existe link público, para ainda conseguir ver a prova.
3. Como visitante, não quero ver botão de link em certificação sem comprovante, para não clicar em algo quebrado.
4. Como visitante, quero que o número de certificações do hero bata com o que a página `/certificates` lista, para confiar nos dados.
5. Como Conan, quero um registro de quais certificações já têm comprovante e quais faltam, para ir completando aos poucos.
6. Como Conan, quero que o site nunca aponte para `google.com` como credencial, para não passar impressão de dado falso.
7. Como Conan, quero que a graduação UNIASSELVI (ADS, jul. 2025) apareça com o ano correto no perfil, para refletir minha formação atual.
8. Como Conan, quero decidir se palestra, graduação e teste de inglês contam no número do hero, para o número ser honesto.
9. Como Conan, quero que arquivos de comprovante fiquem num local previsível e com nome em slug, para encontrá-los e referenciá-los fácil.
10. Como visitante, quero que links externos abram em nova aba com `noopener noreferrer`, para navegar com segurança.

## Implementation Decisions

- Dados continuam em `data/certifications.json`; campos opcionais `url` e `file` por item (tipo `Certification` já os prevê; confirmar e ajustar se faltar).
- Passo 1 (agente): remover `url` provisório de todos os 25 itens. Resultado imediato: nenhum botão de link aparece até Conan fornecer comprovantes.
- Passo 2 (Conan fornece, agente aplica): para cada item da lista abaixo, Conan entrega link e/ou arquivo; agente grava `url`/`file` e coloca arquivo em `public/certificates/<id>.<ext>`. Pode ser em lotes; itens pendentes ficam sem link.
- Se um item tem os dois, a página já trata `url` como ação principal e `file` como secundária; não mudar.
- Número do hero (`profile.stats.certifications`): **suposição** = manter 25 (conta todos os itens da página, para o número bater com a lista). Alternativa: só cursos (22 ou 23). Conan confirma; se mudar, atualizar `profile.stats.certifications` e o texto do hero se mencionar "cursos".
- `profile.education.year`: **suposição** = 2025 (conclusão ADS, jul. 2025) em vez de 2024. Instituição `Centro Universitário Leonardo da Vinci` / `UNIASSELVI` já está correta.
- Itens: Palestrante (Defensoria RS), AI Fluency, Claude Code In Action, Full Cycle (BD relacionais, Cloud AWS, Docker produção, POO, Git/Github, Arquitetura MVC, Auth JWT/ACL/RBAC, SOLID, Docker dev, Docker prática, REST), EF SET, ADS UNIASSELVI, Alura (React Native Hooks, Laravel x2, PHP 8 cursos, Git/GitHub, SQL MySQL, Modelagem), Origamid HTML/CSS, Curso em Vídeo Python 3 Mundo 3.
- Ao concluir: marcar os itens no `TODO.md`.

## Testing Decisions

Sem testes automáticos (portfólio; ver AGENTS.md). Seam acordado: nenhum automatizado. Verificação: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build` e checagem manual em `/certificates` (item com `url` abre nova aba; item com `file` abre arquivo; item sem nenhum não mostra botão; hero mostra número correto e leva a `/certificates`).

## Out of Scope

- Redesenho da página `/certificates`.
- Hospedar/validar credenciais em serviço externo.
- Traduções (site é só pt).

## Further Notes

Obter os comprovantes depende de Conan (Linkedin "Exibir credencial", PDFs). O agente não consegue fazer isso sozinho; a spec fica pronta para o passo 1 e para aplicar os lotes que Conan entregar.
