/* ================= v4.3: VINCULAR A CONTA DO ARENA (passo a passo com telas reais) ================= */
const VIMG = f => (location.protocol === 'file:' ? SITE : '') + 'img/guia/' + f;
/* hl: destaques sobre a imagem, em % [x, y, largura, altura, rótulo] */
const VSTEPS = [
  {t:'Crie a conta no Untapped e instale o Companion', tr:'all', svg:'companion',
   d:`O <b>Untapped.gg</b> é gratuito e lê a sua coleção do MTG Arena. Faça isto uma vez, no computador:
     <ol><li>Entre em <b>untapped.gg</b> e crie uma conta (pode ser com Google).</li><li>Baixe e instale o <b>Untapped.gg Companion</b> (Windows ou Mac).</li><li>Abra o Companion, entre com a sua conta e depois abra o <b>MTG Arena</b>. O Companion lê a coleção sozinho.</li></ol>`,
   tip:'Sempre que ganhar cartas novas, abra o Arena com o Companion ligado: a coleção do site se atualiza.'},
  {t:'Abra o seu perfil no site do Untapped', tr:'all', img:'untapped-perfil.webp',
   hl:[[19.5,14,12,9,'1'],[84.5,5,14,10,'2']],
   d:`Em <b>mtga.untapped.gg</b>, clique no seu avatar e entre no <b>Perfil</b>. A tela certa é esta: aparece "Perfil de…", o progresso da coleção e os curingas.
     <ul class="v-leg"><li><span class="v-n">1</span> Diz se o perfil está <b>Público</b> ou Privado.</li><li><span class="v-n">2</span> "Exportar Coleção" tem cadeado porque é do plano Premium. <b>Você não precisa dele.</b></li></ul>`},
  {t:'Deixe o perfil Público', tr:'all', img:'untapped-perfil.webp', hl:[[19.5,14,12,9,'']],
   d:`Se estiver escrito <b>Privado</b>, clique em <b>(Alterar)</b> e escolha <b>Público</b>. Sem isso, a Academia não consegue ler as cartas.`,
   tip:'Público quer dizer que quem tiver o link do seu perfil consegue ver a sua coleção. Ninguém consegue mexer na sua conta.'},
  {t:'Confira a coleção e copie o endereço', tr:'all', img:'untapped-colecao.webp', hl:[[0,3,17,15,'1'],[17,3,17.5,15,'2']],
   d:`Role a página até ver as abas <b>Meus conjuntos</b> <span class="v-n">1</span> e <b>Minhas cartas</b> <span class="v-n">2</span>: você está na sua coleção.
     <ol><li>Clique na barra de endereço do navegador (ou aperte <kbd>Ctrl</kbd>+<kbd>L</kbd>).</li><li>Copie (<kbd>Ctrl</kbd>+<kbd>C</kbd>). O endereço tem este formato: <code>mtga.untapped.gg/…/profile/…/…/collection</code></li></ol>`},
  {t:'Cole na Academia e toque em Buscar', tr:'all', img:'acad-url.webp', hl:[[2.2,43,95.6,15,'1'],[2.2,62,44.5,26,'2']],
   d:`Na Academia, vá em <b>Arena e coleção → Coleção do Arena</b>.
     <ul class="v-leg"><li><span class="v-n">1</span> Cole o endereço no campo "Cole aqui a URL da sua coleção do Untapped".</li><li><span class="v-n">2</span> Toque em <b>Buscar minha coleção</b>.</li></ul>
     Se as cartas entrarem direto, pule para o último passo.`},
  {t:'Apareceu o aviso? Crie o favorito (uma vez só)', tr:'all', img:'acad-bloqueio.webp', hl:[[36.3,61,51.4,8.8,'']],
   d:`O mais comum é aparecer "O navegador não deixou a Academia ler o Untapped direto". É uma proteção normal dos navegadores.
     <ol><li>Aperte <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> para mostrar a barra de favoritos.</li><li><b>Arraste</b> o botão <b>Enviar coleção para a Academia</b> até essa barra.</li></ol>`,
   tip:{site:'Crie o favorito pelo site: ele manda as cartas para o site.', file:'Crie o favorito pelo arquivo HTML: assim ele já sabe que você usa o arquivo e mostra o botão de copiar a lista.'}},
  {t:'No Untapped, clique no favorito', tr:'site', img:'untapped-favorito-site.webp', hl:[[64.5,58.8,34.8,39.6,''],[65.6,69.6,19.2,6.5,'1']],
   d:`Volte para a página da sua coleção no Untapped e clique no favorito <b>Enviar coleção para a Academia</b>. Em alguns segundos aparece a janela da Academia no canto da tela. Toque em <b>Abrir na Academia e adicionar</b>.`},
  {t:'No Untapped, clique no favorito e copie', tr:'file', img:'untapped-favorito-file.webp', hl:[[64.5,56.4,34.8,42,''],[65.6,67.6,9.1,5.9,'1']],
   d:`Volte para a página da sua coleção no Untapped e clique no favorito <b>Enviar coleção para a Academia</b>. Na janela que aparece no canto, toque em <b>Copiar lista</b>.`},
  {t:'Pronto: as cartas chegam sozinhas', tr:'site', img:'academia-colecao.webp', hl:[[52,18,13,8,'']],
   d:`A Academia abre numa aba nova, confere as cartas e mostra a sua coleção: quantas cartas diferentes e o total. Neste exemplo, <b>1486 cartas diferentes</b>.`},
  {t:'Volte ao arquivo e cole a lista', tr:'file', img:'acad-colar.webp', hl:[[47.4,62,41.8,26,'']],
   d:`Abra o arquivo da Academia, vá em <b>Arena e coleção → Coleção do Arena</b> e toque em <b>Colar a lista copiada</b>. Se o navegador pedir permissão para ler a área de transferência, aceite. Ou cole com <kbd>Ctrl</kbd>+<kbd>V</kbd> na caixa de lista e toque em <b>Adicionar à coleção</b>.`},
  {t:'Crie decks com as suas cartas e leve para o Arena', tr:'all', img:'acad-novo.webp', hl:[[2.5,74.5,95,20.5,'']],
   d:`Logo abaixo fica <b>Criar um deck novo para o MTG Arena</b>. Escolha o formato, responda às perguntas e, no fim, toque em <b>Copiar para o Arena</b>. No Arena: <b>Decks → Importar</b>.`,
   tip:'Também dá para montar uma estratégia pronta (Burn, Aristocratas…) em Construir → Estratégias do Magic → Com as minhas cartas do Arena.'}
];
const VFAQ = [
  ['Colei o link e nada aconteceu', 'Você deve estar com uma versão antiga da Academia. Atualize: no site, recarregue a página (ou toque em "Atualizar agora" no aviso); no arquivo HTML, baixe o arquivo novo.'],
  ['O favorito não faz nada', 'Confira se você está na página da coleção do Untapped (o endereço termina em /collection). Se mesmo assim não funcionar, use o plano B do aviso: "Não consegui arrastar" → copie o código, aperte F12 na página do Untapped, abra a aba Console, cole e aperte Enter.'],
  ['Diz "Não consegui ler a coleção"', 'O perfil está Privado ou a página não é a da coleção. Deixe o perfil Público (passo 3), recarregue a página do Untapped e clique no favorito de novo.'],
  ['Minhas cartas novas não aparecem', 'Abra o MTG Arena com o Untapped Companion ligado para sincronizar, espere a "Última atualização" do perfil mudar e repita o passo do favorito. A Academia junta com o que você já tinha.'],
  ['O Arena disse "título de card desconhecido"', `<img class="v-faq-img" src="${VIMG('arena-erro.webp')}" alt="Tela real do MTG Arena com o erro ao importar deck" loading="lazy">A lista tem uma carta que não existe no Arena (no exemplo, Sol Ring). Na Academia, use sempre o botão <b>Copiar para o Arena</b>: ele confere as cartas e troca as que não existem lá.`],
  ['Jogo só no celular', 'O Companion roda no computador. Sem PC, dá para exportar cada deck no Arena (Decks → selecione o deck → Exportar) e colar na caixa da Coleção do Arena: as cartas desses decks entram na coleção.']
];
let vTrack = location.protocol === 'file:' ? 'file' : 'site', vStep = 0;
const vList = () => VSTEPS.filter(s => s.tr === 'all' || s.tr === vTrack);
function vImgHTML(s){
  if (s.svg) return `<div class="v-img v-svg">${GI.pc(`<rect x="12" y="32" width="296" height="40" rx="8" fill="#26222f"/>${GI.txt(24, 57, 'Untapped.gg Companion', 13, '#f3d68c', 800)}${GI.btn(214, 42, 84, 22, 'Conectado', true)}<rect x="12" y="80" width="296" height="108" rx="8" fill="#14121a"/>${GI.txt(24, 102, 'MTG Arena detectado ✓', 11, '#7fe0a0', 700)}${GI.txt(24, 122, 'Coleção sincronizada: 1.896 cartas', 11, '#e9e3d2', 600)}${GI.txt(24, 142, 'Deixe aberto enquanto joga.', 10, '#8a8070', 600)}${GI.tap(256, 53)}`, 'Untapped.gg Companion')}<small class="muted">Ilustração (o Companion roda no seu computador)</small></div>`;
  return `<button class="v-img" data-vzoom="${s.img}" aria-label="Ampliar imagem"><img src="${VIMG(s.img)}" alt="${esc(s.t)}" loading="lazy">${(s.hl || []).map(h => `<span class="v-hl" style="left:${h[0]}%;top:${h[1]}%;width:${h[2]}%;height:${h[3]}%">${h[4] ? `<i>${h[4]}</i>` : ''}</span>`).join('')}</button><small class="v-cap">Toque na imagem para ampliar</small>`;
}
function renderVinculo(){
  const L = vList(); if (vStep >= L.length) vStep = L.length - 1; const s = L[vStep];
  const done = S.vincDone || {};
  const tip = s.tip ? (typeof s.tip === 'string' ? s.tip : s.tip[vTrack]) : '';
  $('#deckBody').innerHTML = `<div class="panel stack-v v-wrap"><h3>Vincular a sua conta do Arena</h3>
    <p class="muted" style="margin:0">Em ${L.length} passos, as cartas que você tem no MTG Arena aparecem na Academia. As fotos são telas reais do Untapped, do Arena e da Academia.</p>
    <div class="v-tracks" role="radiogroup" aria-label="Como você usa a Academia">
      <button class="v-track" data-vtr="site" aria-pressed="${vTrack==='site'}"><b>Uso pelo site (link)</b><small>leorios40.github.io/academia-mtg</small>${location.protocol !== 'file:' ? '<span class="pill good">Você está aqui</span>' : ''}</button>
      <button class="v-track" data-vtr="file" aria-pressed="${vTrack==='file'}"><b>Uso pelo arquivo HTML</b><small>o arquivo baixado no PC ou celular</small>${location.protocol === 'file:' ? '<span class="pill good">Você está aqui</span>' : ''}</button></div>
    <div class="v-prog"><span style="width:${Math.round((vStep + 1) / L.length * 100)}%"></span></div>
    <div class="v-dots">${L.map((x, i) => `<button class="v-dot ${i === vStep ? 'on' : ''} ${done[x.t] ? 'ok' : ''}" data-vgo="${i}" aria-label="Passo ${i + 1}: ${esc(x.t)}">${done[x.t] ? '✓' : i + 1}</button>`).join('')}</div>
    <div class="v-step" key="${vStep}">
      <div class="v-media">${vImgHTML(s)}</div>
      <div class="v-txt"><span class="v-big">Passo ${vStep + 1} de ${L.length}</span><b class="v-t">${s.t}</b><div class="v-d">${s.d}</div>${tip ? `<div class="tip" style="font-size:.9rem">${tip}</div>` : ''}
        <div class="row-h v-nav"><button class="btn" id="vPrev" ${vStep ? '' : 'disabled'}>← Voltar</button>
        ${vStep < L.length - 1 ? `<button class="btn primary" id="vNext">Feito, próximo passo →</button>` : `<button class="btn primary" id="vEnd">Concluir</button>`}</div>
        ${vStep >= 4 ? `<button class="btn small" id="vGoColl">Abrir a Coleção do Arena</button>` : ''}</div>
    </div>
    <div id="vFin"></div>
    <details class="v-faq"><summary><b>Deu algum problema?</b> Soluções para os casos mais comuns</summary>${VFAQ.map(([q, a]) => `<details><summary>${q}</summary><div>${a}</div></details>`).join('')}</details></div>`;
  const mark = () => { S.vincDone = Object.assign(S.vincDone || {}, {[s.t]: 1}); save(); };
  $$('[data-vtr]').forEach(b => b.onclick = () => { vTrack = b.dataset.vtr; vStep = 0; renderVinculo(); });
  $$('[data-vgo]').forEach(b => b.onclick = () => { vStep = +b.dataset.vgo; renderVinculo(); });
  $('#vPrev').onclick = () => { vStep--; renderVinculo(); };
  const n = $('#vNext'); if (n) n.onclick = () => { mark(); vStep++; renderVinculo(); const w = $('.v-dots'); if (w && w.getBoundingClientRect().top < 60) w.scrollIntoView({block:'start'}); };
  const e = $('#vEnd'); if (e) e.onclick = () => { mark(); if (!S.vincXP) { S.vincXP = 1; addXP(15); } save(); $('#vFin').innerHTML = `<div class="v-fin"><div class="v-conf">${Array.from({length:24}, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div><b>Conta vinculada!</b><p>Agora a Academia conhece as suas cartas. Que tal montar o primeiro deck?</p><div class="row-h" style="justify-content:center"><button class="btn primary" id="vNew">Criar um deck para o Arena</button><button class="btn" id="vSt">Ver as estratégias</button></div></div>`; $('#vNew').onclick = anStart; $('#vSt').onclick = () => { stOpen = null; deckTab = 'estrat'; show('construir'); }; $('#vFin').scrollIntoView({block:'center', behavior:'smooth'}); };
  const gc = $('#vGoColl'); if (gc) gc.onclick = () => { deckTab = 'acoll'; RENDER.decks(); window.scrollTo({top:0}); };
  $$('[data-vzoom]').forEach(b => b.onclick = () => vZoom(b));
}
function vZoom(b){
  const z = document.createElement('div'); z.className = 'v-zoomer'; z.setAttribute('role', 'dialog'); z.setAttribute('aria-label', 'Imagem ampliada');
  z.innerHTML = `<div class="v-zbox">${b.innerHTML}</div><button class="btn small" aria-label="Fechar">Fechar ✕</button>`;
  const close = () => { z.remove(); document.removeEventListener('keydown', k); };
  const k = e => { if (e.key === 'Escape') close(); };
  z.onclick = close; document.addEventListener('keydown', k); document.body.appendChild(z);
}
document.addEventListener('keydown', e => { if (deckTab !== 'vincular' || !$('.v-wrap') || /INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '') || $('.v-zoomer')) return; if (e.key === 'ArrowRight' && $('#vNext')) $('#vNext').click(); if (e.key === 'ArrowLeft' && vStep) $('#vPrev').click(); });
/* registra a aba e os atalhos */
(function(){
  SECTIONS.arena.tabs.unshift(['vincular', 'Vincular a conta do Arena']);
  const d0 = DECK_R; DECK_R = () => Object.assign(d0(), {vincular: renderVinculo});
  TAB_IC.vincular = 'swap'; TAB_HINT.vincular = 'Suas cartas na Academia';
  TAB_TXT.vincular = 'Vincular a conta do Arena: passo a passo com telas reais para as suas cartas do MTG Arena aparecerem na Academia (pelo site ou pelo arquivo HTML).';
  FEATS.push(['Vincular a conta do Arena','Passo a passo com telas reais: suas cartas do Arena na Academia','vincular conta arena untapped colecao minhas cartas importar colecao companion favorito passo a passo imagens',() => { vStep = 0; deckTab = 'vincular'; show('arena'); }]);
  const rc = renderACollection;
  renderACollection = function(){ rc(); const u = $('#deckBody .unt-box'); if (u && !$('#vLink')) { u.querySelector('label').insertAdjacentHTML('beforebegin', `<button class="btn small v-linkbtn" id="vLink">Primeira vez? Veja o passo a passo com telas reais</button>`); $('#vLink').onclick = () => { vStep = 0; deckTab = 'vincular'; RENDER.decks(); window.scrollTo({top:0}); }; } };
  const rg = renderGuides;
  renderGuides = function(){ rg(); if (guideOpen === 'colecao' && !$('#vFromG')) { const b = $('#gdBody'); if (b) b.insertAdjacentHTML('afterbegin', `<div class="tip" id="vFromG">Há uma versão mais completa, com telas reais: <button class="btn small primary" id="vFromGb">Vincular a conta do Arena</button></div>`); const x = $('#vFromGb'); if (x) x.onclick = () => { vStep = 0; deckTab = 'vincular'; RENDER.decks(); }; } };
})();
