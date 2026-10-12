# Microsoft Clarity (adiado)

Status: ready-for-agent
Bloqueio: depende de Conan criar o projeto no Clarity. Marcado "deixar para depois" no TODO.

## Problem Statement

`site.analytics.clarityId` está vazio, então o Clarity fica desligado e Conan não tem dados de uso do site.

## Solution

Conan cria o projeto no Microsoft Clarity e fornece o ID; o site passa a carregar o script só quando o ID existe.

## User Stories

1. Como Conan, quero ver mapas de calor e gravações de sessão, para entender como visitantes usam o site.
2. Como Conan, quero que o script só carregue quando houver ID, para não rodar analytics quebrado em dev ou sem configuração.
3. Como visitante, quero que o script não atrase o carregamento da página, para a experiência continuar rápida.
4. Como Conan, quero trocar o ID só em `data/site.json`, para não mexer em código.

## Implementation Decisions

- Conan cria projeto em clarity.microsoft.com (passo humano) e passa o ID.
- Agente grava o ID em `site.analytics.clarityId`.
- O root layout já injeta Clarity a partir desse campo; **conferir** que renderiza vazio sem erro e que carrega com estratégia não bloqueante (ex.: `afterInteractive`).
- Avaliar aviso de privacidade/consentimento (LGPD): **suposição** = fora de escopo agora, registrar em Further Notes.

## Testing Decisions

Sem testes automáticos (ver AGENTS.md). Seam acordado: nenhum automatizado. Verificação: `pnpm check`, `pnpm exec tsc --noEmit`, `pnpm build`; manual: com ID, aba Network mostra request para `clarity.ms`; sem ID, nenhum request.

## Out of Scope

- Outras ferramentas de analytics, banner de cookies.

## Further Notes

Clarity grava sessões; vale considerar aviso de privacidade antes de ativar em produção.
