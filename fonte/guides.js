/* ================= v3.8: PASSO A PASSO ILUSTRADO E AVISO DE VERSÃO NOVA ================= */
/* ---------- ilustrações (telas simplificadas desenhadas em SVG) ---------- */
const GI = {
  tap:(x, y) => `<g class="gi-tap"><circle cx="${x}" cy="${y}" r="13" fill="rgba(243,214,140,.35)"/><circle cx="${x}" cy="${y}" r="6" fill="#f3d68c" stroke="#1a1208" stroke-width="2"/></g>`,
  bar:(x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h || 8}" rx="${(h || 8) / 2}" fill="${c || '#c9c1b0'}"/>`,
  btn:(x, y, w, h, t, hi, dark) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2.6}" fill="${hi ? '#d9ac4e' : dark ? '#2a2633' : '#f7f3ea'}" stroke="${hi ? '#1a1208' : '#8a8070'}" stroke-width="${hi ? 2.5 : 1.2}"/><text x="${x + w / 2}" y="${y + h / 2 + 4.5}" text-anchor="middle" font-size="12" font-weight="800" fill="${hi ? '#1b1408' : dark ? '#e8e0d0' : '#2b2310'}">${t}</text>${hi ? `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="${h / 2.2}" fill="none" stroke="#f3d68c" stroke-width="2" stroke-dasharray="4 3"/>` : ''}`,
  txt:(x, y, t, s, c, w) => `<text x="${x}" y="${y}" font-size="${s || 12}" font-weight="${w || 700}" fill="${c || '#2b2310'}">${t}</text>`,
  browser:(url, body, hiUrl) => `<svg viewBox="0 0 320 200" class="gi" role="img" aria-label="Ilustração"><rect x="2" y="2" width="316" height="196" rx="12" fill="#efeae0" stroke="#1a1208" stroke-width="3"/><rect x="2" y="2" width="316" height="30" rx="12" fill="#2a2633"/><circle cx="18" cy="17" r="4" fill="#e0603a"/><circle cx="30" cy="17" r="4" fill="#d9ac4e"/><circle cx="42" cy="17" r="4" fill="#4cae6b"/><rect x="56" y="9" width="250" height="16" rx="8" fill="${hiUrl ? '#fff6d8' : '#f7f3ea'}" stroke="${hiUrl ? '#d9ac4e' : 'none'}" stroke-width="2"/><text x="64" y="21" font-size="10" fill="#2b2310" font-family="monospace">${url}</text>${body}</svg>`,
  phone:(body, dark) => `<svg viewBox="0 0 200 300" class="gi gi-ph" role="img" aria-label="Ilustração"><rect x="4" y="4" width="192" height="292" rx="24" fill="#1a1208"/><rect x="12" y="16" width="176" height="268" rx="14" fill="${dark ? '#14121c' : '#efeae0'}"/><rect x="80" y="8" width="40" height="5" rx="2.5" fill="#3a3346"/>${body}</svg>`,
  pc:(body, title) => `<svg viewBox="0 0 320 200" class="gi" role="img" aria-label="Ilustração"><rect x="2" y="2" width="316" height="196" rx="10" fill="#1d1a24" stroke="#1a1208" stroke-width="3"/><rect x="2" y="2" width="316" height="22" rx="10" fill="#2f2a3a"/><text x="12" y="17" font-size="10" fill="#cfc6b8" font-weight="700">${title || ''}</text>${body}</svg>`
};
const GSCR = {
  untapCollection: () => GI.browser('mtga.untapped.gg/profile/…/collection', `${GI.txt(16, 52, 'Seu perfil', 13)}${GI.btn(16, 62, 80, 22, 'Coleção', true)}${GI.btn(104, 62, 70, 22, 'Decks')}${GI.btn(182, 62, 80, 22, 'Partidas')}${[0,1,2,3,4,5].map(i => `<rect x="${16 + i * 49}" y="100" width="42" height="58" rx="5" fill="${['#e0603a','#4a95d6','#4cae6b','#9a7fb0','#f1e7c0','#c9c3b5'][i]}" stroke="#1a1208" stroke-width="1.5"/>`).join('')}${GI.tap(56, 73)}`, false),
  untapCopy: () => GI.browser('mtga.untapped.gg/profile/9f3a…/X7K2…/collection', `${GI.txt(16, 56, 'Toque na barra de endereço e copie', 12)}<rect x="56" y="30" width="250" height="0"/>${GI.btn(212, 62, 92, 24, 'Copiar', true)}${GI.txt(16, 110, 'Confira se o perfil está público:', 11, '#5f574b', 600)}${GI.btn(16, 120, 150, 24, 'Perfil: Público ✓')}${GI.tap(180, 17)}`, true),
  vscode: () => GI.pc(`<rect x="10" y="30" width="80" height="160" rx="4" fill="#26222f"/>${GI.txt(16, 46, 'export_cards.py', 9, '#cfc6b8', 600)}${GI.txt(16, 60, 'README.md', 9, '#8a8070', 600)}<rect x="98" y="30" width="212" height="96" rx="4" fill="#2a2633"/>${GI.txt(106, 46, 'Claude', 10, '#f3d68c', 800)}${GI.bar(106, 54, 180, 6, '#5a5268')}${GI.bar(106, 66, 150, 6, '#5a5268')}${GI.bar(106, 78, 170, 6, '#5a5268')}<rect x="98" y="132" width="212" height="58" rx="4" fill="#0f0d14"/>${GI.txt(106, 148, '> python export_cards.py "https://…"', 9, '#7fe0a0', 600)}${GI.txt(106, 164, 'Found 1234 unique cards!', 9, '#f3d68c', 700)}${GI.txt(106, 180, 'cards_with_quantity.txt', 9, '#cfc6b8', 600)}`, 'VS Code · pasta MTGA-Collection-Exporter'),
  fileTxt: () => GI.pc(`<rect x="14" y="34" width="292" height="152" rx="6" fill="#efeae0"/>${GI.txt(26, 54, 'cards_with_quantity.txt', 12, '#2b2310', 800)}${['4 Llanowar Elves','4 Lightning Bolt','2 Sheoldred, the Apocalypse','1 Beledros Witherbloom','3 Go for the Throat'].map((l,i) => GI.txt(26, 76 + i * 18, l, 11, '#2b2310', 600)).join('')}${GI.btn(200, 150, 96, 24, 'Ctrl+A, Ctrl+C', true)}`, 'Bloco de Notas'),
  acadColl: () => GI.phone(`<rect x="12" y="16" width="176" height="34" rx="14" fill="#110e17"/>${GI.txt(24, 38, 'Academia', 12, '#f6e7bf', 800)}${GI.txt(22, 72, 'Coleção do Arena', 13)}<rect x="22" y="82" width="156" height="60" rx="8" fill="#fff" stroke="#c9c1b0"/>${GI.txt(30, 100, 'Cole uma lista…', 10, '#8a8070', 600)}${GI.btn(22, 152, 156, 26, 'Adicionar à coleção')}${GI.btn(22, 186, 156, 26, 'Enviar arquivo', true)}${GI.btn(22, 230, 156, 30, 'Criar deck com as minhas', false, true)}${GI.tap(150, 199)}`),
  acadOwn: () => GI.phone(`<rect x="12" y="16" width="176" height="34" rx="14" fill="#110e17"/>${GI.txt(24, 38, 'Criar deck do zero', 11, '#f6e7bf', 800)}${GI.txt(22, 70, 'De onde vêm as cartas?', 11)}${GI.btn(22, 80, 156, 26, 'Qualquer carta')}${GI.btn(22, 112, 156, 26, 'Só as minhas do Arena', true)}${GI.btn(22, 144, 156, 26, 'Coleção física')}${GI.txt(22, 196, 'Aggro Vermelho', 11)}<rect x="22" y="204" width="156" height="8" rx="4" fill="#c9c1b0"/><rect x="22" y="204" width="140" height="8" rx="4" fill="#4cae6b"/>${GI.txt(22, 228, '90% com cartas suas', 10, '#5f574b', 700)}${GI.tap(150, 125)}`),
  acadCopy: () => GI.phone(`<rect x="12" y="16" width="176" height="34" rx="14" fill="#110e17"/>${GI.txt(24, 38, 'Seu deck · 60 cartas', 11, '#f6e7bf', 800)}<rect x="22" y="62" width="156" height="110" rx="8" fill="#14121a"/>${['Deck','4 Goblin Guide','4 Lightning Bolt','4 Monastery Swiftspear','20 Mountain'].map((l,i) => GI.txt(30, 80 + i * 18, l, 10, '#e9e3d2', 600)).join('')}${GI.btn(22, 184, 156, 30, 'Copiar para o Arena', true)}${GI.btn(22, 222, 156, 26, 'Salvar em Meus decks')}${GI.tap(150, 199)}`),
  arenaDecks: (hi) => GI.phone(`<rect x="12" y="16" width="176" height="30" rx="14" fill="#221c16"/>${GI.txt(70, 36, 'Decks', 13, '#e8dcc2', 800)}${[0,1,2,3].map(i => `<rect x="${24 + (i % 2) * 80}" y="${60 + Math.floor(i / 2) * 84}" width="72" height="76" rx="6" fill="${['#5b2a7a','#24928c','#c46f2a','#3a6ea8'][i]}" stroke="#000" stroke-width="1.5"/>`).join('')}<rect x="12" y="236" width="176" height="48" fill="#221c16"/>${GI.btn(20, 246, 72, 28, 'Exportar', hi === 'exp', true)}${GI.btn(108, 246, 72, 28, 'Importar', hi === 'imp', true)}${hi === 'exp' ? '<rect x="22" y="58" width="76" height="80" rx="7" fill="none" stroke="#f3d68c" stroke-width="3"/>' + GI.tap(56, 260) : GI.tap(144, 260)}`, true),
  arenaDone: () => GI.phone(`<rect x="12" y="16" width="176" height="30" rx="14" fill="#221c16"/>${GI.txt(52, 36, 'Deck importado', 12, '#e8dcc2', 800)}<rect x="24" y="60" width="152" height="90" rx="8" fill="#c46f2a" stroke="#000"/>${GI.txt(32, 170, 'Cartas que faltam aparecem', 10, '#e8dcc2', 600)}${GI.txt(32, 184, 'para criar com curingas.', 10, '#e8dcc2', 600)}${[0,1,2,3].map(i => `<g transform="translate(${36 + i * 34},200)"><path d="M12 0 L24 12 L12 24 L0 12Z" fill="${['#ff7a3a','#e3b65a','#b9c8d8','#6b6b6b'][i]}" stroke="#000"/></g>`).join('')}${GI.btn(40, 240, 120, 28, 'Jogar', true, true)}`, true),
  acadImport: () => GI.phone(`<rect x="12" y="16" width="176" height="34" rx="14" fill="#110e17"/>${GI.txt(24, 38, 'Meus decks · Importar', 11, '#f6e7bf', 800)}<rect x="22" y="62" width="156" height="120" rx="8" fill="#fff" stroke="#d9ac4e" stroke-width="2"/>${['Deck','4 Elfos de Llanowar (FDN) 227','4 Hidra Musgonata (FDN) 107','16 Floresta (FDN) 280'].map((l,i) => GI.txt(30, 80 + i * 18, l, 9, '#2b2310', 600)).join('')}${GI.btn(22, 194, 156, 30, 'Conferir cartas', true)}${GI.tap(150, 209)}`)
};
const GUIDES = [
  {k:'colecao', t:'Trazer a minha coleção do Arena para a Academia', d:'Pelo Untapped.gg, com o exportador no PC. Assim a Academia sabe quais cartas você tem e cria decks só com elas.', steps:[
    ['Abra a sua coleção no site do Untapped', 'No PC, entre no site do Untapped.gg com a conta vinculada ao Arena. Com o Arena aberto e o Untapped Companion ligado, a coleção sincroniza. Clique no seu avatar → Coleção.', 'untapCollection'],
    ['Copie o endereço da coleção', 'Clique na barra de endereço e copie o link (formato mtga.untapped.gg/profile/…/collection). Nas configurações do Untapped, deixe o perfil como público.', 'untapCopy'],
    ['Rode o exportador', 'Baixe o MTGA-Collection-Exporter do GitHub (Code → Download ZIP), abra a pasta no VS Code e peça para o Claude rodar: python export_cards.py "seu link". Ele cria o arquivo cards_with_quantity.txt.', 'vscode'],
    ['Pegue o arquivo com as suas cartas', 'O arquivo cards_with_quantity.txt traz uma carta por linha, com a quantidade. Você pode enviar o arquivo direto ou abrir no Bloco de Notas e copiar tudo.', 'fileTxt'],
    ['Envie para a Academia', 'Na Academia: Arena e coleção → Coleção do Arena → Enviar arquivo (ou cole o texto e toque em Adicionar à coleção).', 'acadColl'],
    ['Crie decks com as suas cartas', 'Em Construir → Criar deck do zero, escolha "Só as minhas cartas do Arena". A Academia mostra quanto de cada estilo dá para montar com o que você tem.', 'acadOwn']
  ], tip:'Sem PC? Exporte cada deck no Arena (veja o terceiro guia) e cole na Coleção do Arena: as cartas desses decks entram na sua coleção.'},
  {k:'paraArena', t:'Levar um deck da Academia para o MTG Arena', d:'Para qualquer deck criado, melhorado ou importado na Academia.', steps:[
    ['Copie a lista na Academia', 'No resultado do deck, toque em "Copiar para o Arena". A Academia confere se todas as cartas existem no Arena e, se alguma não existir, oferece trocar por equivalentes.', 'acadCopy'],
    ['Abra o Arena na tela Decks', 'No MTG Arena (celular ou PC), vá em Decks. Na parte de baixo da tela fica o botão Importar.', 'arenaDecks:imp'],
    ['Importe', 'Toque em Importar: o Arena lê a lista copiada e cria o deck. Cartas que você ainda não tem aparecem para criar com curingas.', 'arenaDone']
  ], tip:'Se o Arena disser "título de card desconhecido", a lista tem uma carta que não existe no Arena: use "Copiar para o Arena" na Academia, que corrige isso.'},
  {k:'doArena', t:'Trazer um deck do Arena para a Academia', d:'Para entender, melhorar, testar ou fazer o orçamento das cartas físicas.', steps:[
    ['Exporte o deck no Arena', 'No Arena, vá em Decks, selecione o deck e toque em Exportar, na parte de baixo da tela. A lista vai para a área de transferência.', 'arenaDecks:exp'],
    ['Cole na Academia', 'Na Academia: Meus decks → Importar deck → Colar lista → Conferir cartas. Funciona com a lista em português ou inglês.', 'acadImport'],
    ['Use as ferramentas', 'Depois de conferir, escolha: Melhorar meu deck, Entender o deck, Orçamento das cartas físicas, Testar no duelo ou Salvar em Meus decks.', 'acadCopy']
  ], tip:''}
];
let guideOpen = 'colecao';
function guideHTML(G){
  return `<div class="gd-steps">${G.steps.map(([t,d,img],i) => { const [k, arg] = img.split(':'); return `<div class="gd-step"><div class="gd-img">${GSCR[k](arg)}</div><div class="gd-txt"><span class="gd-n">${i+1}</span><b>${t}</b><p>${d}</p></div></div>`; }).join('')}</div>
    ${G.tip ? `<div class="tip" style="font-size:.92rem">${G.tip}</div>` : ''}`;
}
function renderGuides(){
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Passo a passo com imagens</h3>
    <p class="muted" style="margin:0">Escolha o que você quer fazer. As imagens são ilustrações simplificadas das telas: no seu aparelho, os botões podem estar em posições um pouco diferentes.</p>
    <div class="gd-tabs">${GUIDES.map(G => `<button class="gd-tab" data-gd="${G.k}" aria-pressed="${guideOpen===G.k}"><b>${G.t}</b><small>${G.d}</small></button>`).join('')}</div>
    <div id="gdBody">${guideHTML(GUIDES.find(G => G.k === guideOpen))}</div>
    <div class="row-h"><button class="btn" id="gdColl">Ir para a Coleção do Arena</button><button class="btn" id="gdImp">Ir para Importar deck</button></div></div>`;
  $$('[data-gd]').forEach(b => b.onclick = () => { guideOpen = b.dataset.gd; renderGuides(); });
  $('#gdColl').onclick = () => { deckTab = 'acoll'; RENDER.decks(); };
  $('#gdImp').onclick = () => { deckTab = 'importar'; RENDER.decks(); };
}
SECTIONS.arena.tabs.unshift(['guias','Passo a passo com imagens']);
(function(){ const d0 = DECK_R; DECK_R = () => Object.assign(d0(), {guias:renderGuides}); })();
TAB_IC.guias = 'book'; TAB_HINT.guias = 'Coleção, Arena e importar';
TAB_TXT.guias = 'Passo a passo com imagens: trazer sua coleção do Arena (Untapped), levar um deck para o Arena e trazer um deck do Arena.';
FEATS.push(['Passo a passo com imagens','Como trazer sua coleção, importar e exportar decks do Arena','passo a passo tutorial guia como importar exportar arena untapped coleção imagens ajuda',() => { deckTab = 'guias'; show('arena'); }]);
/* links "ver passo a passo" nas telas de importar e de coleção */
(function(){
  const ri = renderImport; renderImport = function(){ ri(); const h = $('#deckBody .panel > h3'); if (h && !$('.gd-link')) h.insertAdjacentHTML('afterend', `<button class="btn small gd-link" data-gdgo="doArena">Ver o passo a passo com imagens</button>`); bindGdLinks(); };
  const rc = renderACollection; renderACollection = function(){ rc(); const h = $('#deckBody .panel > h3'); if (h && !$('.gd-link')) h.insertAdjacentHTML('afterend', `<button class="btn small gd-link" data-gdgo="colecao">Ver o passo a passo com imagens</button>`); bindGdLinks(); };
})();
function bindGdLinks(){ $$('[data-gdgo]').forEach(b => b.onclick = () => { guideOpen = b.dataset.gdgo; deckTab = 'guias'; RENDER.decks(); window.scrollTo({top:0}); }); }

/* ---------- aviso de versão nova ---------- */
async function checkNewVersion(){
  try {
    const base = location.protocol === 'file:' ? SITE : location.origin + location.pathname.replace(/[^/]*$/, '');
    const r = await fetch(base + 'version.json?t=' + Date.now(), {cache:'no-store'}); if (!r.ok) return;
    const j = await r.json(); const nv = String(j.v || '');
    const newer = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < Math.max(x.length, y.length); i++) { if ((x[i]||0) > (y[i]||0)) return true; if ((x[i]||0) < (y[i]||0)) return false; } return false; };
    if (!nv || !newer(nv, CUR_VER) || S.verDismiss === nv) return;
    const file = location.protocol === 'file:';
    const el = document.createElement('div'); el.className = 'upd-bar'; el.setAttribute('role', 'status');
    el.innerHTML = `<b>Versão nova disponível: ${esc(nv)}</b><span>Você está usando a ${esc(CUR_VER)}. ${j.t ? esc(j.t) + '.' : ''} ${file ? 'Este arquivo é uma cópia antiga: abra o site para ter a versão mais nova (seu progresso deste arquivo fica neste navegador).' : 'Toque em Atualizar para carregar a versão nova.'}</span>
      <div class="row-h">${file ? `<a class="btn small primary" href="${SITE}" target="_blank" rel="noopener">Abrir o site atualizado</a>` : '<button class="btn small primary" id="updGo">Atualizar agora</button>'}<button class="btn small" id="updX">Depois</button></div>`;
    document.body.appendChild(el);
    const g = $('#updGo'); if (g) g.onclick = async () => { try { const regs = await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map(r => r.update())); const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); } catch(e){} location.reload(); };
    $('#updX').onclick = () => { S.verDismiss = nv; save(); el.remove(); };
  } catch(e) {}
}
setTimeout(checkNewVersion, 3500);
