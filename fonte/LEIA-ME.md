# Fonte da Academia do Planeswalker

O site publicado é o `index.html` da raiz. Ele é gerado juntando estes arquivos:

1. `part5.html`: cabeçalho, estilos (CSS) e estrutura da página.
2. Scripts, nesta ordem: `data.js`, `fmt_data.js`, `app.js`, `fmt_app.js`, `decks2.js`, `sim.js`, `treino.js`, `extras.js`, `game.js`, `mods.js`, `ui.js`, `cover.js`, `init.js`.

O conjunto é convertido com esbuild (alvo chrome61/safari12) para funcionar em celulares mais antigos e colocado dentro de uma única tag `<script>` no fim do `part5.html`.

Para pedir mudanças: abra uma conversa com o Claude com o GitHub vinculado e cite o repositório `LeoRios40/academia-mtg`.
