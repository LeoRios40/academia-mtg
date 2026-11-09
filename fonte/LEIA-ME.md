# Fonte da Academia do Planeswalker

O site publicado é o `index.html` da raiz. Ele é gerado juntando estes arquivos:

1. `part7.html`: cabeçalho, estilos (CSS) e estrutura da página.
2. Scripts, nesta ordem (veja `build.sh`): data.js, fmt_data.js, app.js, fmt_app.js, decks2.js, sim.js, sim2.js, treino.js, extras.js, game2.js, mods.js, entenda.js, gen.js, import.js, optflow.js, assist.js, library.js, arenafix.js, own.js, mods3.js, versions.js, ui.js, search.js, tools32.js, teach.js, surv3.js, layout32.js, appinst.js, guides.js, untap.js, arenanew.js, estrat.js, vinculo.js, feat45.js, cover.js, init.js.

O conjunto é convertido e compactado com esbuild (alvo chrome61/safari12, `--minify`) e colocado numa única tag `<script>` no fim do `part7.html`. O passo a passo está em `build.sh`. No `index.html` publicado entram ainda as tags `theme-color` e `apple-touch-icon` no cabeçalho.

Para pedir mudanças: abra uma conversa com o Claude com o GitHub vinculado e cite o repositório `LeoRios40/academia-mtg`.

Ao publicar uma versão nova, acrescente um item no topo de `VERSIONS` em `versions.js`: quem já usa a Academia vê o aviso de novidades ao abrir.

A cada versão nova, atualize também o `version.json` da raiz (campo `v` igual ao número da versão em `versions.js`): é ele que faz aparecer o aviso "Versão nova disponível" para quem está com uma cópia antiga.

As imagens do passo a passo "Vincular a conta do Arena" ficam em `img/guia/` (o arquivo HTML baixado carrega essas imagens do site).
