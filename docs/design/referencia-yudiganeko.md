# Referência de design: yudiganeko.com

Mapeamento do design de <https://www.yudiganeko.com/>, extraído do HTML renderizado e do CSS de produção (`/_next/static/chunks/59433b8c32db605d.css`) em 2026-10-12. Serve de base para reproduzir a linguagem visual aqui.

Stack de origem: Next.js (App Router, Turbopack) + Tailwind CSS **v4** + `next/font` (Geist). Este projeto usa Tailwind **v3**, então os tokens abaixo já vêm convertidos para `tailwind.config` + variáveis CSS.

---

## 1. Identidade em uma frase

Página pessoal **monoespaçada**, tons quentes de papel (off-white/aveia) com tinta azul-ardósia, e **laranja "flame" / terracota** como único acento. Minimalista, quase um terminal editorial: pouca decoração, muito espaço vertical, hierarquia feita por cor/opacidade e não por tamanho.

---

## 2. Tipografia

| Papel | Fonte | Observação |
|---|---|---|
| **Toda a UI** | **Geist Mono** (variável, 100–900) | Aplicada no wrapper raiz: `font-mono tracking-wide` |
| Sans (definida, quase não usada) | Geist (variável, 100–900) | Exposta como `--font-geist-sans` |
| `body` fallback | `Arial, Helvetica, sans-serif` | Só afeta o que fica fora do wrapper mono (logo e botão de tema, que são imagem/ícone) |

Carregamento: `next/font/google` com `Geist` e `Geist_Mono`, variáveis `--font-geist-sans` / `--font-geist-mono`, `font-display: swap`, classe `antialiased` no `<body>`.

> Este projeto já usa Geist. Basta trocar a fonte padrão das páginas para a mono (`font-mono`) e aplicar `tracking-wide` (`letter-spacing: 0.025em`).

### Escala usada (Tailwind padrão)

| Token | Tamanho / line-height | Onde |
|---|---|---|
| `text-xs` | 12px / 16px | labels de apps e redes, "Oi! Eu sou o" (mobile) |
| `text-sm` | 14px / 20px | parágrafos do hero (mobile), bullets da experiência, footer |
| `text-base` | 16px / 24px | parágrafos do hero (desktop), "Sobre mim", abas da experiência |
| `text-lg` | 18px / 28px | base do `<main>`; nome no hero (mobile) |
| `text-2xl` | 24px / 32px | títulos de seção (`Sobre mim:`, `Minha experiência:`), cargo |
| `text-3xl` | 30px / 36px | nome no hero (desktop) |

Ou seja: **o maior texto do site tem 30px**. A presença vem do mono + espaço, não de display gigante.

### Pesos

- `400` padrão em quase tudo (inclusive o nome no hero)
- `500` (`font-medium`) em palavras destacadas no texto corrido e nos labels dos apps
- `700` (`font-bold`) só nos títulos de seção e no cargo
- `600` (`font-semibold`) aparece no media-kit

### Detalhes

- Títulos de seção terminam com dois-pontos: `Sobre mim:`, `Minha experiência:`.
- Parágrafos longos: `leading-7` (28px), hero `leading-7 sm:leading-8`.
- Links inline: `underline underline-offset-4`, decoração do acento a 40%, 100% no hover.
- Marcador de lista: caractere `▸` em `text-burning-flame`, `mr-3`.

---

## 3. Paleta de cores

### Cores de marca (nomes originais do site)

| Nome | Hex | Uso |
|---|---|---|
| **Palladian** | `#F9F7F4` | Fundo (light) / texto principal (dark) |
| **Oatmeal** | `#C9C1B1` | Bordas, fundo de hover (com opacidade) |
| **Blue Fantastic** | `#2C3B4D` | Texto principal (light) / superfícies e bordas (dark) |
| **Abyssal** | `#1B2632` | Fundo (dark) |
| **Burning Flame** | `#FFB162` | Acento: bordas de hover, marcadores `▸`, ring do avatar, texto de destaque no dark |
| **Truffle Trouble** | `#A35139` | Acento de texto no light (links, palavras destacadas, empresa ativa) |

Lógica do acento: no **light** o texto destacado é *truffle* (terracota escuro, contraste bom sobre papel); no **dark** vira *flame* (laranja claro). Bordas e detalhes gráficos são sempre *flame*.

### Tokens semânticos (`:root` / `.dark`)

| Token | Light | Dark |
|---|---|---|
| `--background` | `#F9F7F4` (palladian) | `#1B2632` (abyssal) |
| `--foreground` | `#2C3B4D` (blue-fantastic) | `#F9F7F4` (palladian) |
| `--body-color` | `#2C3B4D` | `#D8D2C4` |
| `--surface` | `#F4F0E8` | `#243142` |
| `--surface-strong` | `#E3DCCD` | `#2C3B4D` |
| `--border` | `#C9C1B1` (oatmeal) | `#3A4A5D` |
| `--muted` | `#6B7785` | `#8A96A4` |
| `--accent` | `#A35139` (truffle) | `#FFB162` (flame) |
| `--accent-strong` | `#FFB162` | `#FFB162` |

### Hierarquia de texto por opacidade

Em vez de vários cinzas, o site usa a cor de texto com alpha:

| Nível | Light | Dark |
|---|---|---|
| Principal | `blue-fantastic` | `palladian` |
| Corpo de lista | `blue-fantastic/80` | `palladian/80` |
| Label | `blue-fantastic/70` | `palladian/70` |
| Secundário / datas | `blue-fantastic/60` | `palladian/60` |
| Footer | `blue-fantastic/50` | `palladian/50` |

### Paleta secundária "media-kit" (`--mk-*`)

Definida para a página `/media-kit`, tom mais editorial:

| Token | Light | Dark |
|---|---|---|
| `--mk-bg` | `#F9F7F4` | `#171B24` |
| `--mk-bg2` | `#FCFBF8` | `#1F2733` |
| `--mk-surface` | `#FEFCF8` | `#262F3C` |
| `--mk-surface2` | `#F0EDE6` | `#2E3846` |
| `--mk-paper` | `#FEFEFA` | `#1F2733` |
| `--mk-ink` | `#1C1E26` | `#F9F7F4` |
| `--mk-muted` | `#5A5854` | `#BCB4A4` |
| `--mk-faint` | `#8A8276` | `#7C7569` |
| `--mk-line` | `rgba(28,30,38,.12)` | `rgba(249,247,244,.12)` |
| `--mk-line-strong` | `rgba(28,30,38,.28)` | `rgba(249,247,244,.28)` |
| `--mk-flame` | `#FFB162` | — |
| `--mk-truffle` | `#A35149` | — |
| `--mk-indigo` | `#1F2733` | — |

Há também um gradiente pontual `#7C3AED → #A855F7 → #EC4899` (roxo→rosa), provavelmente para um selo/CTA do media-kit. Fora da paleta principal; não recomendo copiar.

### Cores de marcas citadas (só no texto do hero)

iFood `red-600 / dark:red-500` (`#E40014` / `#FB2C36`), Boticário `green-700 / dark:green-500` (`#008138` / `#00C758`), C6 `truffle / dark:flame`, Revolut `gray-900 / dark:gray-100`.

---

## 4. Forma, espaço e layout

- **Radius**: `rounded-xl` (12px) nos tiles de ícone, `rounded-lg` (8px) na foto, `rounded-full` no avatar e no botão de tema. Media-kit usa até `rounded-[28px]`.
- **Sombras**: praticamente nenhuma. Profundidade vem de borda + fundo translúcido.
- **Bordas**: 1px `oatmeal/60` (light) / `blue-fantastic` (dark). Item ativo: `border-l-2 border-burning-flame`.
- **Container**: sem max-width global; padding lateral responsivo `px-4 md:px-10 lg:px-30 xl:px-60` (16 → 40 → 120 → 240px). Conteúdo do hero limitado a `max-w-3xl` (768px), centralizado.
- **Hero** ocupa `min-h-screen`, centralizado vertical e horizontalmente.
- **Ritmo vertical**: blocos do hero `gap-6 sm:gap-10`, títulos `mb-10`, footer `mt-20`.
- **Logo** e **botão de tema** são `fixed top-4 left-4` / `top-4 right-4`, `z-50`, sem navbar. Logo é PNG preto com `dark:invert`.

---

## 5. Componentes

### Hero

```
[avatar 56/80px, ring-2 flame/70, ring-offset-2 bg]  Oi! Eu sou o           (text-xs/sm)
                                                     Yudi Ganeko :)▌        (text-lg/3xl, typewriter)
```

- Nome com efeito **typewriter** (texto invisível reserva largura com `invisible whitespace-pre`, o texto animado fica `absolute inset-0`, evitando layout shift).
- Abaixo, parágrafos centralizados contando a história, com nomes de empresa coloridos e ícone inline de 18px.

### Tile de ícone (apps e redes sociais)

```html
<a class="group flex w-16 flex-col items-center gap-2 sm:w-24 sm:gap-3">
  <span class="flex h-12 w-12 items-center justify-center rounded-xl border
               border-oatmeal/60 bg-palladian/60 transition-all duration-300
               group-hover:border-burning-flame group-hover:bg-oatmeal/40
               sm:h-14 sm:w-14
               dark:border-blue-fantastic dark:bg-blue-fantastic/40
               dark:group-hover:bg-blue-fantastic/70">
    <img src="…" width="32" height="32" alt="…" />
  </span>
  <span class="text-center text-xs font-medium text-blue-fantastic/70
               transition-colors group-hover:text-truffle-trouble
               dark:text-palladian/70 dark:group-hover:text-burning-flame">
    Nome
  </span>
</a>
```

Redes sociais usam o mesmo tile, com o label virando métrica (`+117 mil inscritos`) em `/60`.

### Link inline de destaque

```html
<a class="text-truffle-trouble underline decoration-truffle-trouble/40
          underline-offset-4 transition-colors hover:decoration-truffle-trouble
          dark:text-burning-flame dark:decoration-burning-flame/40
          dark:hover:decoration-burning-flame">
```

### Palavra destacada no texto corrido

`text-truffle-trouble dark:text-burning-flame font-medium`

### Abas verticais (experiência)

- Lista à esquerda (`flex-col py-8 px-2`), cada item `text-base px-4 py-2 mb-2 cursor-pointer transition-all`.
- **Ativo**: `text-truffle-trouble dark:text-burning-flame border-l-2 border-burning-flame bg-oatmeal/25 dark:bg-blue-fantastic/50`.
- **Inativo**: `text-blue-fantastic/60 dark:text-palladian/60 hover:text-truffle-trouble dark:hover:text-burning-flame`.
- Painel à direita (`flex-1 p-8`): `Cargo @ Empresa` em `text-2xl font-bold` com `@ Empresa` no acento; período em `/60` (formato `ABR 2025 - SET 2025`, caixa alta); bullets `text-sm leading-7 space-y-4` com `▸`.
- Mobile: empilha (`flex-col sm:flex-row`).

> Ao reproduzir, use `<button type="button">` com `role="tab"` em vez de `<li>` clicável (o Biome daqui exige `useKeyWithClickEvents`, e é o certo para a11y).

### Botão de tema

`fixed top-4 right-4 z-50 p-2 rounded-full border border-oatmeal/60 bg-palladian/70 hover:bg-oatmeal/40 hover:border-burning-flame transition-colors` + equivalentes `dark:`. Ícone 20px. Tema via classe `.dark` no `<html>`.

### Footer

`text-center text-sm text-blue-fantastic/50 dark:text-palladian/50 mt-20`, duas linhas.

---

## 6. Movimento

| Nome | Definição | Uso |
|---|---|---|
| `mk-fadeUp` | `opacity 0→1`, `translateY(8px)→0` | entrada de blocos |
| `mk-marquee` | `translateX(0)→-50%` loop | faixa de logos/marcas (media-kit) |
| `ping` | padrão Tailwind | indicador "ao vivo"/status |
| hover lift | `hover:-translate-y-0.5` | cards |
| transições | `duration-300` nos tiles, `transition-colors` (150ms, `cubic-bezier(.4,0,.2,1)`) no resto | |
| typewriter | nome do hero | |

Tudo em `transform`/`opacity`, alinhado com `.cursor/rules/animation-guidelines.mdc`. Ao reproduzir, desligar `fadeUp`, `marquee` e o typewriter com `prefers-reduced-motion` (o original não faz isso).

---

## 7. Como implementar aqui (Tailwind 3)

### `globals.css`

```css
@layer base {
  :root {
    --palladian: 249 247 244;
    --oatmeal: 201 193 177;
    --blue-fantastic: 44 59 77;
    --abyssal: 27 38 50;
    --burning-flame: 255 177 98;
    --truffle-trouble: 163 81 57;

    --background: var(--palladian);
    --foreground: var(--blue-fantastic);
    --body-color: var(--blue-fantastic);
    --surface: 244 240 232;
    --surface-strong: 227 220 205;
    --border: var(--oatmeal);
    --muted: 107 119 133;
    --accent: var(--truffle-trouble);
    --accent-strong: var(--burning-flame);
  }

  .dark {
    --background: var(--abyssal);
    --foreground: var(--palladian);
    --body-color: 216 210 196;
    --surface: 36 49 66;
    --surface-strong: 44 59 77;
    --border: 58 74 93;
    --muted: 138 150 164;
    --accent: var(--burning-flame);
  }

  body {
    @apply bg-background font-mono tracking-wide text-body antialiased;
  }
}
```

Canais RGB separados por espaço permitem `bg-oatmeal/40`, `text-blue-fantastic/60` etc. no Tailwind 3.

> Cuidado: shadcn/ui já define `--background`, `--foreground`, `--border`, `--muted`, `--accent` em **HSL** neste projeto. Ou converta os valores acima para HSL e substitua os do shadcn, ou use prefixo (`--yg-*`) para não quebrar os componentes existentes.

### `tailwind.config.ts`

```ts
const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`

export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palladian: rgb('--palladian'),
        oatmeal: rgb('--oatmeal'),
        'blue-fantastic': rgb('--blue-fantastic'),
        abyssal: rgb('--abyssal'),
        'burning-flame': rgb('--burning-flame'),
        'truffle-trouble': rgb('--truffle-trouble'),
        background: rgb('--background'),
        foreground: rgb('--foreground'),
        body: rgb('--body-color'),
        surface: { DEFAULT: rgb('--surface'), strong: rgb('--surface-strong') },
        muted: rgb('--muted'),
        accent: { DEFAULT: rgb('--accent'), strong: rgb('--accent-strong') },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
}
```

Durações de `fade-up` e `marquee` não estavam no CSS (vêm de estilo inline/JS); os valores acima são pontos de partida.

### Checklist de fidelidade

- [ ] Wrapper/página em `font-mono tracking-wide`
- [ ] Fundo papel `#F9F7F4`, texto `#2C3B4D`; dark `#1B2632` / `#F9F7F4`
- [ ] Um acento só: truffle (light) / flame (dark); bordas de hover sempre flame
- [ ] Hierarquia por opacidade (`/80`, `/70`, `/60`, `/50`), não por novos cinzas
- [ ] Nada acima de `text-3xl`; títulos de seção `text-2xl font-bold` terminando em `:`
- [ ] Tiles `rounded-xl` com borda oatmeal translúcida, sem sombra
- [ ] Logo e toggle de tema fixos nos cantos, sem navbar
- [ ] `prefers-reduced-motion` respeitado
