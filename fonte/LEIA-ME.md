# Fonte da Academia do Planeswalker

O site publicado é o `index.html` da raiz. Ele é gerado juntando estes arquivos:

1. `part7.html`: cabeçalho, estilos (CSS) e estrutura da página.
2. Scripts, nesta ordem: `data.js`, `fmt_data.js`, `app.js`, `fmt_app.js`, `decks2.js`, `sim.js`, `sim2.js`, `treino.js`, `extras.js`, `game2.js`, `mods.js`, `entenda.js, gen.js, import.js, optflow.js, assist.js, library.js, arenafix.js, search.js, tools32.js, teach.js, surv2.js, layout32.js`, `mods3.js`, `versions.js`, `ui.js`, `cover.js`, `init.js`.

O conjunto é convertido e compactado com esbuild (alvo chrome61/safari12, `--minify`) e colocado numa única tag `<script>` no fim do `part7.html`. O passo a passo está em `build.sh`. No `index.html` publicado entram ainda as tags `theme-color` e `apple-touch-icon` no cabeçalho.

Para pedir mudanças: abra uma conversa com o Claude com o GitHub vinculado e cite o repositório `LeoRios40/academia-mtg`.

Ao publicar uma versão nova, acrescente um item no topo de `VERSIONS` em `versions.js`: quem já usa a Academia vê o aviso de novidades ao abrir.
