set -e
T=/tmp/claude-0/-home-claude/0554b777-b22d-5539-bda0-fe45f712a78a/scratchpad
cd /home/claude
FILES="data.js fmt_data.js app.js fmt_app.js decks2.js sim.js sim2.js treino.js extras.js game2.js mods.js entenda.js gen.js import.js optflow.js assist.js library.js arenafix.js own.js mods3.js versions.js ui.js search.js tools32.js teach.js layout32.js appinst.js guides.js untap.js arenanew.js estrat.js vinculo.js feat45.js feat46.js cover.js init.js"
cat $FILES > $T/bundle.js
node --check $T/bundle.js
$T/tools/node_modules/.bin/esbuild $T/bundle.js --target=chrome61,safari12,firefox60 --minify --outfile=$T/bundle.es.js --log-level=warning
# o jogo vai num bloco separado e só é executado quando a aba do jogo é aberta (abertura mais leve)
node --check surv3.js
$T/tools/node_modules/.bin/esbuild surv3.js --target=chrome61,safari12,firefox60 --minify --outfile=$T/g3.es.js --log-level=warning
if grep -q "</script" $T/g3.es.js; then echo "ERRO: </script dentro do jogo"; exit 1; fi
{ cat part7.html; echo '<script type="text/plain" id="lz-g3">'; cat $T/g3.es.js; echo "</script>"; echo "<script>"; cat $T/bundle.es.js; echo "</script>"; echo "</body></html>"; } > out/Academia_do_Planeswalker.html
wc -c out/Academia_do_Planeswalker.html
