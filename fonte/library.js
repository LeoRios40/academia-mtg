/* ================= v3.0: SEÇÕES, MEUS DECKS, LINK, PROXIES, PREÇO, SIDEBOARD, DUELO, COLEÇÃO DO ARENA ================= */

/* ---------- seções (as antigas abas Decks e Treino viraram várias seções do menu) ---------- */
const SECTIONS = {
  construir:{kind:'deck', h:'Construir', p:'Crie um deck do zero respondendo perguntas, melhore o seu com trocas que você aprova, monte o sideboard e teste contra o computador.',
    tabs:[['gerar','Criar deck do zero'],['otimizar','Melhorar meu deck'],['entenda','Entenda seu deck'],['side','Sideboard'],['testar','Testar no duelo'],['guia','Guia de construção'],['desafios','Desafios de construção']]},
  decks:{kind:'deck', h:'Analisar', p:'Os números do seu deck: curva de mana, cores, terrenos, chance de comprar cada carta, mãos iniciais e sugestões.',
    tabs:[['analise','Analisador'],['mao','Mão inicial'],['prob','Probabilidade'],['base','Base de mana'],['sugestoes','Sugestões de cartas'],['comparar','Comparar listas']]},
  meus:{kind:'deck', h:'Meus decks', p:'Seus decks guardados com todas as versões. Importe, compartilhe por link, imprima proxies para testar e veja quanto custa em reais.',
    tabs:[['biblioteca','Meus decks'],['importar','Importar deck'],['preco','Orçamento das cartas físicas'],['link','Compartilhar por link'],['proxies','Imprimir proxies']]},
  arena:{kind:'deck', h:'Arena e coleção', p:'Tudo do MTG Arena e das suas cartas: guia do Arena, coleção do Arena usada pelo gerador, decks famosos, coleção física e lista de desejos.',
    tabs:[['arena','Central do Arena'],['acoll','Coleção do Arena'],['famosos','Decks famosos'],['colecao','Coleção física'],['desejos','Lista de desejos']]},
  treino:{kind:'tr', h:'Treino', p:'Pratique como os veteranos: jogue contra o computador, simule decks, resolva quebra-cabeças e treine bloqueios, mulligan, pilha e Draft.',
    tabs:[['surv','Jogo: Sobreviva ao Multiverso'],['duelo','Partida contra o computador'],['sim','Simulador de deck'],['puz','Quebra-cabeças'],['criar','Criar quebra-cabeça'],['bloq','Bloqueios'],['ler','Ler a mesa'],['mull','Mulligan'],['pilha','Pilha'],['draft','Draft']]},
  mesa:{kind:'tr', h:'Na mesa', p:'Ferramentas para a partida de verdade com os amigos: contador de vida, sorteio de mesas e torneio, árbitro de bolso e calculadora de combate.',
    tabs:[['vida','Contador de vida'],['grupo','Grupo e torneio'],['juiz','Árbitro de bolso'],['calc','Calculadora de combate']]}
};
const DECK_R = () => ({importar:renderImport, otimizar:renderOptFlow, entenda:renderEntenda, gerar:renderAssist, analise:renderAnalyzer, mao:renderHand, prob:renderProb, base:renderManaBase, sugestoes:renderSuggest,
  colecao:renderColl, desejos:renderWish, orcamento:renderPrice, preco:renderPrice, comparar:renderCompare, desafios:renderChal, famosos:renderFamous, arena:renderArenaHub, guia:renderGuide,
  biblioteca:renderLib, link:renderLink, proxies:renderProxies, side:renderSide, testar:renderDuelTest, acoll:renderACollection});
const TR_R = () => ({surv:renderSurv, custom:renderCustomPuz, criar:renderPuzCreator, duelo:renderDuel, sim:renderSim, puz:renderPuz, bloq:renderBlk, ler:renderRead, mull:renderMull, pilha:renderStack, draft:renderDraft, vida:renderLifeIntro, grupo:renderGroup, juiz:renderJudge});
const secOfTab = (kind, t) => { if (t === 'orcamento') return 'meus'; if (t === 'custom') return 'treino'; return Object.keys(SECTIONS).find(v => SECTIONS[v].kind === kind && SECTIONS[v].tabs.some(x => x[0] === t)); };
const lastTab = {};
function renderSection(v){
  const D = SECTIONS[v], deck = D.kind === 'deck';
  let tab = deck ? deckTab : trTab;
  if (tab === 'orcamento') { tab = 'preco'; deckTab = 'preco'; }
  if (secOfTab(D.kind, tab) !== v) { tab = lastTab[v] || D.tabs[0][0]; if (deck) deckTab = tab; else trTab = tab; }
  lastTab[v] = tab; const tl = D.tabs.find(x => x[0] === tab); if (tl) { S.lastTool = {v, tab, l: tl[1], h: D.h}; save(); }
  Object.keys(SECTIONS).forEach(o => { if (o !== v && SECTIONS[o].kind === D.kind) { const el = $('#v-' + o); if (el) el.innerHTML = ''; } });
  const bodyId = deck ? 'deckBody' : 'trBody';
  setTimeout(() => typeof addAreaTour === 'function' && addAreaTour(v), 0);
  $('#v-' + v).innerHTML = `<div class="view-head"><h1>${D.h}</h1><p>${D.p}</p></div>
    ${deck && v !== 'arena' ? deckBarHTML() : ''}
    <div class="tools-grid" role="tablist" aria-label="Ferramentas de ${D.h}">${D.tabs.map(([k,l]) => `<button class="tool" role="tab" data-${deck ? 'dt' : 'tt'}="${k}" aria-selected="${tab===k}">${typeof toolIcon === 'function' ? toolIcon(k) : ''}<span class="tool-t"><b>${l}</b>${typeof TAB_HINT !== 'undefined' && TAB_HINT[k] ? `<small>${TAB_HINT[k]}</small>` : ''}</span></button>`).join('')}</div>
    <div id="${bodyId}"></div>`;
  if (deck) { $$('[data-dt]').forEach(b => b.onclick = () => { deckTab = b.dataset.dt; renderSection(v); }); bindDeckBar(); (DECK_R()[tab] || renderLib)(); }
  else { $$('[data-tt]').forEach(b => b.onclick = () => { if (b.dataset.tt === 'calc') { show('combate'); return; } trTab = b.dataset.tt; renderSection(v); }); if (tab === 'calc') { show('combate'); return; } (TR_R()[tab] || renderDuel)($('#trBody')); try { seen('t_' + tab); } catch(e){} }
}
['construir','meus','arena','mesa'].forEach(v => RENDER[v] = () => renderSection(v));
VIEWS.push('construir','meus','arena','mesa');
(function(){
  RENDER.decks = () => { const v = secOfTab('deck', deckTab) || 'decks'; if (v === 'decks' && currentView === 'decks') return renderSection('decks'); if (currentView === v) return renderSection(v); show(v); };
  RENDER.treino = () => { const v = secOfTab('tr', trTab) || 'treino'; if (currentView === v) return renderSection(v); show(v); };
})();

/* ---------- deck em uso ---------- */
const libAll = () => (S.lib = S.lib || []);
const curDeck = () => libAll().find(d => d.id === S.curDeck);
const deckCount = t => parseDeck(t || '').reduce((a,e)=>a+e.q,0);
function deckBarHTML(){
  const D = curDeck(), n = deckCount(deckText);
  return `<div class="deckbar"><span class="db-ic" aria-hidden="true"></span><div class="db-t"><small>Deck em uso</small><b>${D ? esc(D.name) : n ? 'Deck sem nome' : 'Nenhum deck'}</b><small>${n} cartas${D ? ` · ${D.versions.length} versão(ões)` : ''}</small></div>
    <label class="db-sel"><span class="sr">Trocar de deck</span><select id="dbSel"><option value="">${libAll().length ? 'Trocar de deck…' : 'Nenhum deck guardado'}</option>${libAll().map(d => `<option value="${d.id}" ${d.id===S.curDeck?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label>
    <button class="btn small" id="dbSave" ${n ? '' : 'disabled'}>Salvar em Meus decks</button></div>`;
}
function useDeck(id, vi){
  const D = libAll().find(d => d.id === id); if (!D) return;
  const V = D.versions[vi == null ? D.versions.length - 1 : vi];
  S.curDeck = id; save();
  deckText = V.text; deckFormat = D.cmd || deckCount(V.text) >= 95 ? '100' : deckCount(V.text) <= 45 ? '40' : '60';
  DECK = null; hand = null; ent.txt = V.text; ent.cmd = D.cmd || ''; ent.A = null; ent.status = ''; opt.res = null; ow.sugg = null; ow.step = 1;
}
function bindDeckBar(){
  const s = $('#dbSel'); if (s) s.onchange = () => { if (!s.value) return; useDeck(s.value); toast('Deck trocado. As ferramentas agora usam ' + esc(curDeck().name) + '.'); RENDER[currentView](); };
  const b = $('#dbSave'); if (b) b.onclick = () => openSaveDialog(deckText, {cmd: ent.cmd || '', label:'Versão salva'});
}
/* ---------- guardar decks ---------- */
const newId = () => 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2,5);
const today = () => new Date().toLocaleDateString('pt-BR');
function saveDeck(text, meta){
  const L = libAll(); let D = meta.id ? L.find(d => d.id === meta.id) : null;
  if (!D) { D = {id:newId(), name: meta.name || 'Meu deck', cmd: meta.cmd || '', fmt: meta.fmt || '', created: today(), versions:[]}; L.unshift(D); }
  if (meta.cmd) D.cmd = meta.cmd;
  D.versions.push({d: today(), t: Date.now(), label: meta.label || `Versão ${D.versions.length + 1}`, text});
  S.curDeck = D.id; save(); return D;
}
function guessName(text, cmd){
  if (cmd) return cmd.split(',')[0];
  const E = parseDeck(text).filter(e => !BASICS.includes(e.name.toLowerCase())); const d0 = E.sort((a,b)=>b.q-a.q)[0];
  return d0 ? `Deck de ${d0.name}` : 'Meu deck';
}
function openSaveDialog(text, meta){
  meta = meta || {}; const D = curDeck(); const L = libAll();
  $('#modalBox').innerHTML = `<button class="icon-btn modal-close" aria-label="Fechar" data-close>✕</button><div class="stack-v" style="grid-column:1/-1">
    <span class="eyebrow">Meus decks</span><h2>Salvar deck</h2>
    <p class="muted" style="margin:0">${deckCount(text)} cartas. Guarde como um deck novo ou como uma nova versão de um deck que você já tem: assim dá para comparar e voltar atrás.</p>
    <div class="pick" style="grid-template-columns:1fr 1fr"><button data-sv="new" aria-pressed="${!D}"><b>Deck novo</b><small>Começa uma nova pasta</small></button><button data-sv="ver" aria-pressed="${!!D}" ${L.length ? '' : 'disabled'}><b>Nova versão</b><small>De um deck guardado</small></button></div>
    <label class="f" id="svNameL" for="svName" ${D ? 'hidden' : ''}>Nome do deck<input type="text" id="svName" value="${esc(meta.name || guessName(text, meta.cmd))}"></label>
    <label class="f" id="svDeckL" for="svDeck" ${D ? '' : 'hidden'}>Deck<select id="svDeck">${L.map(d => `<option value="${d.id}" ${D && d.id===D.id?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label>
    <label class="f" for="svLabel">Nome da versão<input type="text" id="svLabel" value="${esc(meta.label || 'Versão ' + today())}"></label>
    <div class="row-h"><button class="btn primary" id="svGo">Salvar</button><button class="btn" data-close>Cancelar</button></div></div>`;
  $('#modal').hidden = false;
  let mode = D ? 'ver' : 'new';
  $$('[data-sv]').forEach(b => b.onclick = () => { mode = b.dataset.sv; $$('[data-sv]').forEach(x => x.setAttribute('aria-pressed', x === b)); $('#svNameL').hidden = mode !== 'new'; $('#svDeckL').hidden = mode !== 'ver'; });
  $('#svGo').onclick = () => {
    const Dd = saveDeck(text, {id: mode === 'ver' ? $('#svDeck').value : null, name: $('#svName').value.trim() || 'Meu deck', label: $('#svLabel').value.trim(), cmd: meta.cmd, fmt: meta.fmt});
    deckText = text; DECK = null; hand = null;
    $('#modal').hidden = true; toast(`Salvo em Meus decks: ${esc(Dd.name)} (${Dd.versions.length} versão${Dd.versions.length > 1 ? 'ões' : ''}).`);
    if (!S.libDone) { S.libDone = true; addXP(20); save(); }
    if (SECTIONS[currentView]) renderSection(currentView);
  };
}
/* botão "Salvar em Meus decks" em todos os resultados (otimizar, criar do zero, gerar) */
(function(){
  const rh = resultHTML, br = bindResult;
  resultHTML = function(id, title, list, cmd, extra){
    return rh(id, title, list, cmd, extra).replace(`<button class="btn" data-tosim="${id}">Simular</button>`, `<button class="btn" data-tosim="${id}">Simular</button><button class="btn" data-savedeck="${id}">Salvar em Meus decks</button><button class="btn" data-toduel="${id}">Jogar contra o computador</button>`);
  };
  bindResult = function(id, list, cmd, fmt){
    br(id, list, cmd, fmt);
    const b = $(`[data-savedeck="${id}"]`); if (b) b.onclick = () => openSaveDialog(arenaList(list, cmd), {cmd: cmd || '', fmt, label: id === 'owRes' ? 'Otimizada' : id === 'asRes' ? 'Criada pela Academia' : 'Versão ' + today()});
    const d = $(`[data-toduel="${id}"]`); if (d) d.onclick = () => { deckText = list.map(e => `${e.q} ${e.name}`).join('\n'); playDuelWith(list); };
  };
})();

/* ---------- 1. Meus decks ---------- */
let libOpen = null;
function deckCols(text){ const p = {W:0,U:0,B:0,R:0,G:0}; parseDeck(text).forEach(e => { const d = cardData(e.name); if (d) { const x = pips(d.c); for (const c in x) p[c] += x[c] * e.q; } }); return Object.entries(p).filter(([,v]) => v).sort((a,b)=>b[1]-a[1]).map(([c]) => c); }
function coverOf(D){ const t = D.versions[D.versions.length-1].text; if (D.cmd) return D.cmd; const E = parseDeck(t).filter(e => !BASICS.includes(e.name.toLowerCase())).sort((a,b)=>b.q-a.q); return E[0] ? E[0].name : ''; }
function renderLib(){
  const L = libAll();
  if (libOpen && !L.find(d => d.id === libOpen)) libOpen = null;
  if (libOpen) return renderLibDeck(libOpen);
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Meus decks</h3>
    ${L.length ? `<p class="muted" style="margin:0">${L.length} deck(s) guardado(s) neste aparelho. Toque em um deck para ver as versões.</p>
      <div class="lib-grid">${L.map(D => { const last = D.versions[D.versions.length-1]; const cv = coverOf(D); const cols = deckCols(last.text);
        return `<button class="deckbox ${D.id===S.curDeck?'cur':''}" data-libo="${D.id}"><span class="dbx-art">${cv ? cardHTML(cv, {showPt:false}) : ''}</span><span class="dbx-info"><b>${esc(D.name)}</b><span class="dbx-pips">${cols.map(manaSym).join('')}</span><small>${deckCount(last.text)} cartas · ${D.versions.length} versão(ões) · ${esc(last.d)}</small>${D.id===S.curDeck ? '<span class="pill good">Em uso</span>' : ''}</span></button>`; }).join('')}</div>
      <div class="row-h"><button class="btn" id="libExport">Baixar todos (.txt)</button><button class="btn" id="libImpGo">Importar outro deck</button></div>`
    : `<p>Você ainda não guardou nenhum deck.</p><p class="muted">Use o botão "Salvar em Meus decks" depois de importar, criar do zero ou melhorar um deck. Cada vez que salvar de novo, vira uma nova versão: dá para comparar e voltar atrás.</p>
      <div class="row-h"><button class="btn primary" id="libImpGo">Importar um deck</button><button class="btn" id="libNew">Criar deck do zero</button>${deckCount(deckText) ? '<button class="btn" id="libSaveCur">Salvar o deck em uso</button>' : ''}</div>`}
  </div>`;
  $$('[data-libo]').forEach(b => b.onclick = () => { libOpen = b.dataset.libo; renderLib(); window.scrollTo({top: $('#deckBody').offsetTop - 70}); });
  const ig = $('#libImpGo'); if (ig) ig.onclick = () => { deckTab = 'importar'; RENDER.decks(); };
  const nw = $('#libNew'); if (nw) nw.onclick = () => { deckTab = 'gerar'; RENDER.decks(); };
  const sc = $('#libSaveCur'); if (sc) sc.onclick = () => openSaveDialog(deckText, {cmd: ent.cmd || ''});
  const ex = $('#libExport'); if (ex) ex.onclick = () => downloadFile('meus_decks.txt', L.map(D => `// ${D.name} (${D.versions[D.versions.length-1].label})\n${D.versions[D.versions.length-1].text}`).join('\n\n'), 'text/plain;charset=utf-8');
}
function diffText(a, b){
  const A = new Map(parseDeck(a).map(e => [e.name, e.q])), B = new Map(parseDeck(b).map(e => [e.name, e.q])); const out = [];
  B.forEach((q,n) => { const p = A.get(n) || 0; if (q > p) out.push(`<li class="good">+${q - p} ${esc(n)}</li>`); });
  A.forEach((q,n) => { const p = B.get(n) || 0; if (q > p) out.push(`<li class="bad">−${q - p} ${esc(n)}</li>`); });
  return out.length ? `<ul class="diff">${out.join('')}</ul>` : '<p class="muted">Sem diferenças.</p>';
}
function renderLibDeck(id){
  const D = libAll().find(d => d.id === id), V = D.versions;
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>${esc(D.name)}</h3>
    <div class="row-h"><button class="btn small" id="libBack">← Todos os decks</button><button class="btn small primary" id="libUse">Usar este deck</button><button class="btn small" id="libRen">Renomear</button><button class="btn small" id="libDel">Excluir deck</button></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));align-items:start">
      <div class="stack-v"><span class="eyebrow">Versões</span><ol class="ver-l">${V.map((v,i) => `<li><div><b>${esc(v.label)}</b><small class="muted"> · ${esc(v.d)} · ${deckCount(v.text)} cartas</small></div>
        <div class="row-h"><button class="btn small" data-vuse="${i}">Usar</button><button class="btn small" data-vcp="${i}">Copiar para o Arena</button>${i ? `<button class="btn small" data-vdf="${i}">O que mudou</button>` : ''}${V.length > 1 ? `<button class="btn small" data-vdel="${i}" aria-label="Excluir versão">✕</button>` : ''}</div><div id="vdf${i}"></div></li>`).join('')}</ol></div>
      <div class="stack-v"><span class="eyebrow">Fazer com este deck</span><div class="next-grid">
        <button class="next hot" data-lgo="otimizar"><b>Melhorar</b><small>Trocas sugeridas para aceitar ou recusar</small></button>
        <button class="next" data-lgo="analise"><b>Analisar</b><small>Curva, cores e terrenos</small></button>
        <button class="next" data-lgo="side"><b>Montar sideboard</b><small>15 cartas e guia de trocas</small></button>
        <button class="next" data-lgo="testar"><b>Jogar contra o computador</b><small>Teste o deck no duelo</small></button>
        <button class="next" data-lgo="link"><b>Compartilhar por link</b><small>Mande no WhatsApp</small></button>
        <button class="next" data-lgo="proxies"><b>Imprimir proxies</b><small>Folhas para testar na mesa</small></button>
        <button class="next" data-lgo="preco"><b>Preço em reais</b><small>Quanto custa o deck físico</small></button>
      </div></div></div>
    <div class="stack-v"><span class="eyebrow">Como o deck fica (última versão)</span>${deckGallery(parseDeck(V[V.length-1].text), D.cmd)}</div></div>`;
  $('#libBack').onclick = () => { libOpen = null; renderLib(); };
  $('#libUse').onclick = () => { useDeck(id); toast('Deck em uso: ' + esc(D.name)); renderSection(currentView); };
  $('#libRen').onclick = () => { const n = prompt('Novo nome do deck:', D.name); if (n && n.trim()) { D.name = n.trim(); save(); renderLibDeck(id); } };
  $('#libDel').onclick = () => { if (confirm(`Excluir "${D.name}" e todas as versões?`)) { S.lib = libAll().filter(d => d.id !== id); if (S.curDeck === id) S.curDeck = null; save(); libOpen = null; renderSection(currentView); } };
  $$('[data-vuse]').forEach(b => b.onclick = () => { useDeck(id, +b.dataset.vuse); toast('Versão em uso: ' + esc(V[+b.dataset.vuse].label)); renderSection(currentView); });
  $$('[data-vcp]').forEach(b => b.onclick = () => copyText(V[+b.dataset.vcp].text));
  $$('[data-vdf]').forEach(b => b.onclick = () => { const i = +b.dataset.vdf; $('#vdf' + i).innerHTML = diffText(V[i-1].text, V[i].text); });
  $$('[data-vdel]').forEach(b => b.onclick = () => { if (confirm('Excluir esta versão?')) { V.splice(+b.dataset.vdel, 1); save(); renderLibDeck(id); } });
  $$('[data-lgo]').forEach(b => b.onclick = () => { useDeck(id); const g = b.dataset.lgo; deckTab = g; if (g === 'otimizar') { RENDER.decks(); entAnalyze().then(() => { if (deckTab === 'otimizar') { ow.step = ent.A ? 2 : 1; renderOptFlow(); } }); } else RENDER.decks(); window.scrollTo({top:0}); });
}

/* ---------- 2. compartilhar por link ---------- */
const SITE = 'https://leorios40.github.io/academia-mtg/';
const b64u = buf => { let s = ''; const a = new Uint8Array(buf); for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); };
const unb64u = s => { const b = atob(s.replace(/-/g,'+').replace(/_/g,'/')); const a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
async function packDeck(text){
  const data = new TextEncoder().encode(text);
  if (window.CompressionStream) { try { const cs = new Blob([data]).stream().pipeThrough(new CompressionStream('deflate-raw')); return 'z' + b64u(await new Response(cs).arrayBuffer()); } catch(e){} }
  return 'p' + b64u(data);
}
async function unpackDeck(code){
  const a = unb64u(code.slice(1));
  if (code[0] === 'z') { const ds = new Blob([a]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return await new Response(ds).text(); }
  return new TextDecoder().decode(a);
}
const compactList = t => parseDeck(t).map(e => `${e.q} ${e.name}`).join('\n');
async function deckLink(text, name, cmd){
  const body = (cmd ? `Commander\n1 ${cmd}\n\nDeck\n` : '') + compactList(text).split('\n').filter(l => !cmd || l.replace(/^\d+\s+/,'') !== cmd).join('\n');
  const base = location.protocol === 'file:' ? SITE : location.origin + location.pathname;
  return `${base}#deck=${await packDeck(body)}&n=${encodeURIComponent(name || '')}`;
}
let linkSt = {url:'', id:''};
function renderLink(){
  const L = libAll(); const n = deckCount(deckText);
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Compartilhar por link</h3>
    <p class="muted" style="margin:0">Transforma o deck num link. Quem abrir vê as imagens, a lista para o Arena e pode analisar e salvar o deck. Funciona no WhatsApp, Telegram, e-mail e redes sociais.</p>
    <label class="f" for="lkSel">Qual deck?<select id="lkSel">${n ? `<option value="__cur">Deck em uso (${n} cartas)</option>` : ''}${L.map(d => `<option value="${d.id}" ${d.id===S.curDeck && !n?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label>
    ${!n && !L.length ? '<p class="muted">Importe ou crie um deck primeiro.</p>' : `<div class="row-h"><button class="btn primary" id="lkGo">Criar link</button></div>`}
    <div id="lkOut"></div></div>`;
  const go = $('#lkGo'); if (!go) return;
  go.onclick = async () => {
    const v = $('#lkSel').value; let text, name, cmd;
    if (v === '__cur') { const D = curDeck(); text = deckText; name = D ? D.name : guessName(deckText, ent.cmd); cmd = ent.cmd || (D && D.cmd) || ''; }
    else { const D = L.find(d => d.id === v); text = D.versions[D.versions.length-1].text; name = D.name; cmd = D.cmd; }
    const url = await deckLink(text, name, cmd); linkSt.url = url;
    const msg = `Olha meu deck de Magic "${name}": ${url}`;
    $('#lkOut').innerHTML = `<div class="stack-v"><label class="f" for="lkUrl">Link do deck<input type="text" id="lkUrl" value="${esc(url)}" readonly></label>
      <div class="row-h"><button class="btn primary" id="lkCopy">Copiar link</button><a class="btn" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Enviar no WhatsApp</a>${navigator.share ? '<button class="btn" id="lkShare">Compartilhar…</button>' : ''}</div>
      <p class="muted" style="font-size:.85rem">O link tem ${url.length} caracteres e guarda a lista inteira: não depende de servidor nem de cadastro.</p></div>`;
    $('#lkCopy').onclick = () => copyText(url, $('#lkUrl'));
    const sh = $('#lkShare'); if (sh) sh.onclick = () => navigator.share({title: name, text: `Meu deck de Magic: ${name}`, url}).catch(()=>{});
  };
}
async function openSharedDeck(hash){
  try {
    const m = hash.match(/deck=([^&]+)(?:&n=(.*))?/); const text = await unpackDeck(m[1]); const name = m[2] ? decodeURIComponent(m[2]) : 'Deck compartilhado';
    imp.txt = text; imp.mode = 'colar'; imp.E = null; imp.shared = name; deckTab = 'importar'; show('meus');
    toast(`Deck recebido por link: ${esc(name)}`);
    runImport(parseImport(text));
  } catch(e) { show('inicio'); toast('Não consegui abrir o deck deste link. Ele pode estar incompleto.'); }
}

/* ---------- 3. proxies para imprimir ---------- */
let prx = {basics:false, mark:true, src:'__cur'};
function renderProxies(){
  const L = libAll(), n = deckCount(deckText);
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Imprimir proxies</h3>
    <p class="muted" style="margin:0">Gera folhas A4 com as cartas no tamanho real (63 × 88 mm, 9 por folha) para testar o deck na mesa antes de comprar. Recorte e coloque na frente de um terreno básico dentro de um protetor de cartas.</p>
    <label class="f" for="pxSel">Qual deck?<select id="pxSel">${n ? `<option value="__cur">Deck em uso (${n} cartas)</option>` : ''}${L.map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select></label>
    <label class="row-h" style="gap:8px"><input type="checkbox" id="pxB" ${prx.basics?'checked':''}> Incluir terrenos básicos</label>
    <label class="row-h" style="gap:8px"><input type="checkbox" id="pxM" ${prx.mark?'checked':''}> Marcar "proxy para teste" em cada carta</label>
    <div class="row-h"><button class="btn primary" id="pxGo" ${n || L.length ? '' : 'disabled'}>Montar as folhas</button></div>
    <p class="muted" id="pxSt" style="font-size:.9rem">Proxies servem para testar em casa e entre amigos. Em torneios oficiais, use as cartas originais.</p>
    <div id="pxOut"></div></div>`;
  $('#pxB').onchange = e => prx.basics = e.target.checked; $('#pxM').onchange = e => prx.mark = e.target.checked;
  $('#pxGo').onclick = async () => {
    const v = $('#pxSel').value; const text = v === '__cur' || !v ? deckText : (D => D.versions[D.versions.length-1].text)(L.find(d => d.id === v));
    const st = m => $('#pxSt').textContent = m;
    const N = await normalizeDeck(text, st); const list = [...N.C.cmd, ...N.C.comp, ...N.C.main].filter(e => prx.basics || !BASICS.includes(e.name.toLowerCase()));
    const cards = []; list.forEach(e => { for (let i = 0; i < e.q; i++) cards.push(e.name); });
    const pages = Math.ceil(cards.length / 9);
    st(`${cards.length} cartas em ${pages} folha(s) A4.${N.unknown.length ? ' Não reconhecidas: ' + N.unknown.join(', ') : ''}`);
    let html = ''; for (let p = 0; p < pages; p++) html += `<div class="pp">${cards.slice(p*9, p*9+9).map(n => { const u = scryImg(n); return `<div class="pc">${u ? `<img src="${esc(u.replace('/normal/','/large/'))}" alt="${esc(n)}" onerror="this.src='${esc(u)}'">` : cardHTML(n, {showPt:false})}${prx.mark ? '<span class="pxm">proxy para teste</span>' : ''}</div>`; }).join('')}</div>`;
    let pa = $('#printArea'); if (!pa) { pa = document.createElement('div'); pa.id = 'printArea'; document.body.appendChild(pa); }
    pa.innerHTML = html;
    $('#pxOut').innerHTML = `<div class="row-h"><button class="btn primary" id="pxPrint">Imprimir ou salvar em PDF</button></div><p class="muted" style="font-size:.85rem">Na janela de impressão, escolha papel A4, escala 100% (tamanho real) e, para PDF, "Salvar como PDF".</p><div class="px-prev">${html}</div>`;
    $('#pxPrint').onclick = () => { const imgs = [...pa.querySelectorAll('img')]; st('Preparando as imagens…'); Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))).then(() => { st('Pronto.'); window.print(); }); };
    if (!S.pxDone) { S.pxDone = true; addXP(10); save(); }
  };
}

/* ---------- 4. preço em reais ---------- */
let fxLive = null;
async function getFx(){
  if (fxLive) return fxLive;
  try { const r = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL'); const j = await r.json(); const v = +j.USDBRL.bid; if (v > 1) { fxLive = v; S.fx = +v.toFixed(2); save(); } } catch(e) {}
  return S.fx || 5.5;
}
const ligaURL = n => `https://www.ligamagic.com.br/?view=cards/card&card=${encodeURIComponent(n)}`;
let prc = {rows:null, src:'', name:''};
function renderPrice(){
  const L = libAll(), n = deckCount(deckText); if (S.fx == null) S.fx = 5.5;
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Preço e lista de compras</h3>
    <p class="muted" style="margin:0">Quer montar no papel o deck que você joga no Arena? Aqui você vê quanto custam as cartas físicas, marca as que já tem e leva a lista de compras pronta. O preço é uma estimativa: média em dólar (Scryfall, lojas americanas) convertida pela cotação do dia. Use o link da LigaMagic em cada carta para ver as lojas do Brasil.</p>
    <div class="grid g2"><label class="f" for="prSel">Qual deck?<select id="prSel">${n ? `<option value="__cur">Deck em uso (${n} cartas)</option>` : ''}${L.map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select></label>
    <label class="f" for="fx">Cotação do dólar (R$)<input type="number" id="fx" step="0.01" min="1" value="${S.fx}"></label></div>
    <label class="row-h" style="gap:8px"><input type="checkbox" id="prOwn" ${S.prOwn !== false ? 'checked' : ''}> Descontar as cartas da minha coleção física (Arena e coleção → Coleção física)</label>
    <div class="row-h"><button class="btn primary" id="prGo" ${n || L.length ? '' : 'disabled'}>Calcular o orçamento</button></div>
    <p class="muted" id="prSt" style="font-size:.9rem"></p><div id="prOut"></div></div>`;
  $('#fx').onchange = e => { S.fx = +e.target.value || 5.5; save(); if (prc.rows) drawPrice(); };
  $('#prOwn').onchange = e => { S.prOwn = e.target.checked; save(); if (prc.rows) { applyOwn(); drawPrice(); } };
  $('#prGo').onclick = async () => {
    const st = m => $('#prSt').textContent = m; const v = $('#prSel').value;
    const D = v && v !== '__cur' ? L.find(d => d.id === v) : null;
    const text = D ? D.versions[D.versions.length-1].text : deckText; prc.name = D ? D.name : (curDeck() ? curDeck().name : 'meu deck');
    st('Conferindo a cotação do dólar…'); await getFx(); $('#fx').value = S.fx;
    const N = await normalizeDeck(text, st); const list = [...N.C.cmd, ...N.C.comp, ...N.C.main, ...N.C.side];
    try { await fetchMeta(list.map(e => e.name), st); } catch(e) { st('Sem conexão com o Scryfall agora. Tente de novo mais tarde.'); return; }
    const ptOfName = {}; [...N.C.cmd, ...N.C.comp, ...N.C.main, ...N.C.side].forEach(e => { if (e.pt) ptOfName[e.name] = e.pt; });
    prc.rows = list.filter(e => !BASICS.includes(e.name.toLowerCase())).map(e => { const m = metaOf(e.name); return {n:e.name, pt: ptOfName[e.name] || (typeof ptOf === 'function' ? ptOf(e.name) : ''), q:e.q, u: m ? m.usd : null, have:0}; }).sort((a,b) => (b.u||0)*b.q - (a.u||0)*a.q);
    applyOwn();
    st(`Cotação usada: R$ ${(+S.fx).toFixed(2)} por dólar${fxLive ? ' (de hoje)' : ''}.${N.unknown.length ? ' Não reconhecidas: ' + N.unknown.join(', ') : ''}`);
    drawPrice(); if (!S.prDone) { S.prDone = true; addXP(15); save(); }
  };
}
function applyOwn(){
  const own = new Map(); if (S.prOwn !== false && S.coll) parseDeck(S.coll).forEach(e => own.set(e.name.toLowerCase(), e.q));
  prc.rows.forEach(r => { r.have = Math.min(r.q, own.get(r.n.toLowerCase()) || (r.pt && own.get(r.pt.toLowerCase())) || 0); });
}
function drawPrice(){
  const R$ = x => (x * S.fx).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
  const rows = prc.rows; const tot = rows.reduce((a,r) => a + (r.u||0) * r.q, 0); const buy = rows.reduce((a,r) => a + (r.u||0) * (r.q - r.have), 0);
  const nBuy = rows.reduce((a,r) => a + r.q - r.have, 0);
  $('#prOut').innerHTML = `<div class="tiles"><div class="stat"><div class="k">Deck completo</div><div class="v">${R$(tot)}</div></div><div class="stat"><div class="k">Falta comprar</div><div class="v">${R$(buy)}</div></div><div class="stat"><div class="k">Cartas para comprar</div><div class="v">${nBuy}</div></div></div>
    <div class="row-h" style="margin-top:12px"><button class="btn primary" id="prCopy">Copiar lista de compras</button><button class="btn" id="prCsv">Baixar lista de compras (planilha)</button><a class="btn" href="https://www.ligamagic.com.br/" target="_blank" rel="noopener">Abrir a LigaMagic ↗</a></div>
    <div class="tbl-wrap" style="margin-top:12px"><table class="pr-tab"><thead><tr><th>Carta</th><th class="n">No deck</th><th class="n">Já tenho</th><th class="n">Unid.</th><th class="n">Falta (R$)</th><th>Lojas</th></tr></thead><tbody>
    ${rows.map((r,i) => `<tr class="${r.have >= r.q ? 'got' : ''}"><td>${cr(r.n)}${r.pt && nrm(r.pt) !== nrm(r.n) ? `<br><small class="muted">${esc(r.pt)}</small>` : ''}</td><td class="n">${r.q}</td><td class="n"><input type="number" min="0" max="${r.q}" value="${r.have}" data-ph="${i}" aria-label="Quantas ${esc(r.n)} você já tem"></td><td class="n">${r.u ? R$(r.u) : '—'}</td><td class="n">${r.u ? R$(r.u * (r.q - r.have)) : '—'}</td><td><a class="ext" href="${ligaURL(r.n)}" target="_blank" rel="noopener">LigaMagic ↗</a></td></tr>`).join('')}
    </tbody></table></div>
    <p class="muted" style="font-size:.85rem">Terrenos básicos não entram na conta. Preços variam com a edição, o idioma e o estado da carta. Para um deck mais barato, use "Melhorar meu deck" com "Só comuns e incomuns".</p>`;
  $$('[data-ph]').forEach(inp => inp.onchange = () => { const r = prc.rows[+inp.dataset.ph]; r.have = Math.max(0, Math.min(r.q, +inp.value || 0)); drawPrice(); });
  const shop = () => prc.rows.filter(r => r.q > r.have);
  $('#prCopy').onclick = () => copyText(shop().map(r => `${r.q - r.have} ${r.n}`).join('\n'));
  $('#prCsv').onclick = () => downloadFile(`compras_${prc.name.replace(/[^\w-]+/g,'_')}.csv`, '﻿' + [['Quantidade','Carta','Nome em português','Preço unitário (R$)','Total (R$)','LigaMagic']].concat(shop().map(r => [r.q - r.have, r.n, r.pt || '', r.u ? (r.u * S.fx).toFixed(2).replace('.',',') : '', r.u ? (r.u * S.fx * (r.q - r.have)).toFixed(2).replace('.',',') : '', ligaURL(r.n)])).map(x => x.map(c => /[;"\n]/.test(String(c)) ? `"${String(c).replace(/"/g,'""')}"` : c).join(';')).join('\r\n'), 'text/csv;charset=utf-8');
}

/* ---------- 5. sideboard ---------- */
const SB_CAT = [
  {k:'aggro', t:'Contra decks agressivos', q:'(t:instant or t:sorcery) mv<=2 (o:"damage to target creature" or o:"destroy target creature" or o:"gets -" or o:"exile target creature" or o:"gain")', out:'caras'},
  {k:'big', t:'Contra criaturas grandes e Ramp', q:'(o:"exile target creature" or o:"destroy target creature") mv<=3 -o:"power 2 or less" -o:"power 3 or less"', out:'baratas'},
  {k:'control', t:'Contra controle e anulações', q:'(o:"can\'t be countered" or o:hexproof or o:"reveals their hand" or o:"target opponent discards")', out:'remocao'},
  {k:'grave', t:'Contra decks de cemitério', q:'(o:"exile target player\'s graveyard" or o:"exile all graveyards" or o:"exile all cards from all graveyards" or o:"exile each opponent\'s graveyard" or o:"exile up to" o:"graveyard")', out:'caras'},
  {k:'arts', t:'Contra artefatos e encantamentos', q:'(o:"destroy target artifact" or o:"destroy target enchantment" or o:"exile target artifact" or o:"exile target enchantment" or o:"destroy target noncreature")', out:'fracas'},
  {k:'fly', t:'Contra voadores', q:'((o:"creature with flying" (o:destroy or o:damage)) or (t:creature o:reach))', out:'fracas'},
  {k:'wide', t:'Contra muitas criaturas pequenas', q:RQ.wipe, out:'remocao'}
];
const SB_FMT = {standard:'Padrão', historic:'Histórico', explorer:'Explorer', pioneer:'Pioneer', modern:'Modern', pauper:'Pauper'};
let sb = {fmt:'standard', res:null, busy:false};
function renderSide(){
  const n = deckCount(deckText);
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Sideboard</h3>
    <p class="muted" style="margin:0">Em torneios de 60 cartas você pode ter 15 cartas de reserva e trocá-las entre as partidas de uma melhor de três. A Academia sugere 15 cartas nas cores do deck em uso e um guia do que entra e do que sai contra cada tipo de oponente.</p>
    ${!n ? '<p>Importe ou escolha um deck primeiro (barra "Deck em uso" acima).</p>' : deckCount(deckText) >= 95 ? '<div class="tip">Decks de Commander e Brawl não têm sideboard. Escolha um deck de 60 cartas.</div>' : `
    <label class="f" for="sbFmt" style="max-width:320px">Formato<select id="sbFmt">${Object.entries(SB_FMT).map(([k,l]) => `<option value="${k}" ${sb.fmt===k?'selected':''}>${l}${['standard','historic','explorer'].includes(k) ? ' (Arena)' : ''}</option>`).join('')}</select></label>
    <div class="row-h"><button class="btn primary" id="sbGo">Montar sideboard</button></div>`}
    <p class="muted" id="sbSt" style="font-size:.9rem"></p><div id="sbOut"></div></div>`;
  const s = $('#sbFmt'); if (s) s.onchange = e => sb.fmt = e.target.value;
  const g = $('#sbGo'); if (g) g.onclick = async () => { if (sb.busy) return; sb.busy = true; g.disabled = true; const st = m => { const e = $('#sbSt'); if (e) e.textContent = m; };
    try { sb.res = await buildSide(st); st(''); drawSide(); } catch(e) { st('Não foi possível consultar o Scryfall agora. Tente de novo.'); }
    sb.busy = false; const b = $('#sbGo'); if (b) b.disabled = false; };
  if (sb.res && sb.res.src === deckText) drawSide();
}
async function buildSide(st){
  const N = await normalizeDeck(deckText, st); const main = N.C.main.concat(N.C.comp);
  const R = analyze(main); const cols = Object.entries(R.pips).filter(([,v]) => v).sort((a,b)=>b[1]-a[1]).map(([c]) => c).slice(0, 3);
  const col = (cols.join('') || 'c').toLowerCase(); const arena = ['standard','historic','explorer'].includes(sb.fmt);
  const have = new Set(main.map(e => e.name));
  const cats = []; const used = new Set();
  for (const C of SB_CAT) {
    st(`Procurando cartas: ${C.t.toLowerCase()}…`);
    let L = []; try { L = await fetchQ(`${C.q} id<=${col} f:${sb.fmt}${arena ? ' game:arena' : ''} -t:land`, 8); } catch(e) { throw e; }
    L = L.filter(n => !have.has(n) && !used.has(n));
    if (L.length) cats.push({...C, cards: L.slice(0, 2)});
  }
  // até 15 cartas: 3 por categoria (2 + 1) nas 5 mais úteis para as cores
  const pick = cats.slice(0, 5); const side = [];
  pick.forEach(C => { C.cards.forEach((n,i) => { const q = i === 0 ? 2 : 1; side.push({name:n, q, cat:C.k}); used.add(n); }); });
  let tot = side.reduce((a,e)=>a+e.q,0); for (const e of side) { if (tot >= 15) break; if (e.q < 3) { e.q++; tot++; } }
  while (tot > 15) { const e = side.find(x => x.q > 1) || side[side.length-1]; e.q--; tot--; if (!e.q) side.splice(side.indexOf(e), 1); }
  // guia: o que sai
  const nonland = R.entries.filter(e => e.k !== 'land' && e.d);
  const byCmc = nonland.slice().sort((a,b) => b.d.cmc - a.d.cmc), cheap = nonland.slice().sort((a,b) => a.d.cmc - b.d.cmc);
  const remo = nonland.filter(e => /destroy target|exile target|damage to target|damage to any target|gets -/i.test(e.d.x||''));
  const weak = nonland.slice().sort((a,b) => a.q - b.q || b.d.cmc - a.d.cmc);
  const outOf = (kind, k) => { const src = kind === 'caras' ? byCmc : kind === 'baratas' ? cheap : kind === 'remocao' ? (remo.length ? remo : weak) : weak; const o = []; let c = 0; for (const e of src) { if (c >= k) break; const q = Math.min(e.q, k - c); o.push(`${q} ${e.name}`); c += q; } return o; };
  const guide = pick.map(C => { const inn = side.filter(e => e.cat === C.k); const k = inn.reduce((a,e)=>a+e.q,0); return {t:C.t, inn: inn.map(e => `${e.q} ${e.name}`), out: outOf(C.out, k)}; });
  return {src: deckText, main, side, guide, cmd: N.cmd};
}
function drawSide(){
  const r = sb.res, box = $('#sbOut'); if (!box || !r) return;
  const text = `Deck\n${r.main.map(e => `${e.q} ${ARN[e.name] || e.name}`).join('\n')}\n\nSideboard\n${r.side.map(e => `${e.q} ${ARN[e.name] || e.name}`).join('\n')}`;
  box.innerHTML = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:start">
    <div class="stack-v"><span class="eyebrow">Sideboard sugerido · ${r.side.reduce((a,e)=>a+e.q,0)} cartas</span>${deckGallery(r.side)}</div>
    <div class="stack-v"><span class="eyebrow">Guia de trocas (melhor de três)</span><div class="sb-guide">${r.guide.map(g => `<div class="sb-g"><b>${g.t}</b><div class="sb-io"><div><span class="pill good">Entram</span><ul>${g.inn.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div><span class="pill bad">Saem</span><ul>${g.out.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div></div>`).join('')}</div>
      <p class="muted" style="font-size:.85rem">Regra da troca: sempre o mesmo número de cartas entra e sai, e o deck principal continua com 60.</p></div></div>
    <span class="eyebrow">Deck + sideboard para importar no Arena</span><pre class="code" id="sbTxt">${esc(text)}</pre>
    <div class="row-h"><button class="btn primary" id="sbCopy">Copiar para o Arena</button><button class="btn" id="sbSave">Salvar em Meus decks</button></div>`;
  $('#sbCopy').onclick = () => copyText(text, $('#sbTxt'));
  $('#sbSave').onclick = () => openSaveDialog(text, {label:'Com sideboard'});
}

/* ---------- 6. testar no duelo ---------- */
function duelSpec(d){
  const x = (d.x || '').replace(/\n/g,' '); let m;
  if ((m = x.match(/deals (\d+) damage to (any target|target creature or player|target creature or planeswalker|target creature)/i))) return {burn:+m[1], inst: d.k === 'instant' ? 1 : 0};
  if (/destroy target creature|exile target creature/i.test(x)) return {kill:1, inst: d.k === 'instant' ? 1 : 0};
  if (/return target creature to its owner's hand/i.test(x)) return {bounce:1, inst: d.k === 'instant' ? 1 : 0};
  if ((m = x.match(/target creature gets \+(\d+)\/\+\d+/i))) return {pump:+m[1], inst: d.k === 'instant' ? 1 : 0};
  if ((m = x.match(/draw (two|three) cards/i))) return {draw: m[1] === 'two' ? 2 : 3, inst: d.k === 'instant' ? 1 : 0};
  if (d.k === 'enchantment' && /enchanted creature can't attack or block/i.test(x)) return {pac:1};
  return null;
}
function buildDuelDeck(list){
  const pool = [], skipped = new Set(); let lands = {W:0,U:0,B:0,R:0,G:0};
  list.forEach(e => { const d = cardData(e.name); if (!d) { skipped.add(e.name); return; }
    if (d.k === 'land' || BASICS.includes(e.name.toLowerCase())) return;
    if (/\{X\}/.test(d.c||'')) { skipped.add(e.name); return; }
    let ok = false;
    if (d.k === 'creature' && /^\d+\/\d+$/.test(d.p || '')) ok = true;
    else if (GSPELL[e.name]) ok = true;
    else { const sp = duelSpec(d); if (sp) { GSPELL[e.name] = sp; ok = true; } }
    if (!ok) { skipped.add(e.name); return; }
    const p = pips(d.c); for (const c in p) lands[c] += p[c] * e.q;
    for (let i = 0; i < e.q; i++) pool.push(e.name); });
  pool.sort((a,b) => cardData(a).cmc - cardData(b).cmc);
  const take = []; const n = Math.min(23, pool.length); for (let i = 0; i < n; i++) take.push(pool[Math.floor(i * pool.length / n)]);
  const cards = {}; take.forEach(x => cards[x] = (cards[x]||0) + 1);
  const cols = Object.entries(lands).filter(([,v]) => v).sort((a,b)=>b[1]-a[1]).map(([c]) => c).slice(0, 2);
  const basics = (cols.length ? cols : ['G']).map(c => BASIC_OF[c]);
  return {deck:{n:'Seu deck', d:`${take.length} cartas do seu deck + terrenos`, lands: basics, cards}, used: take.length, skipped:[...skipped]};
}
function playDuelWith(list){
  const B = buildDuelDeck(list);
  if (B.used < 10) { toast('O duelo ainda não sabe usar cartas suficientes deste deck. Ele aceita criaturas e mágicas simples (dano, destruir, devolver, +X/+X, comprar).'); return; }
  DUEL_DECKS.mine = B.deck; duelSetup.deck = 'mine'; duelSetup.mode = 'ai'; trTab = 'duelo'; G = null; show('treino');
  toast(`Seu deck entrou no duelo com ${B.used} cartas${B.skipped.length ? `; ${B.skipped.length} carta(s) que o duelo ainda não sabe jogar ficaram de fora` : ''}.`);
}
function renderDuelTest(){
  const n = deckCount(deckText);
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Testar no duelo</h3>
    <p class="muted" style="margin:0">Leva o deck em uso para a partida contra o computador. O duelo usa 40 cartas: a Academia pega 23 cartas do seu deck mantendo a curva de mana e completa com terrenos básicos das suas cores.</p>
    <p class="muted" style="margin:0;font-size:.9rem">O duelo entende criaturas (com voar, atropelar, toque mortífero e outras habilidades) e mágicas simples: causar dano, destruir ou exilar criatura, devolver à mão, +X/+X, comprar cartas e Pacifism. Cartas com efeitos mais complexos ficam de fora.</p>
    ${n ? `<div class="row-h"><button class="btn primary" id="dtGo">Jogar contra o computador com este deck</button></div>` : '<p>Importe ou escolha um deck primeiro.</p>'}
    <p class="muted" id="dtSt" style="font-size:.9rem"></p></div>`;
  const g = $('#dtGo'); if (g) g.onclick = async () => { g.disabled = true; const N = await normalizeDeck(deckText, m => $('#dtSt').textContent = m); g.disabled = false; playDuelWith([...N.C.cmd, ...N.C.main]); };
}

/* ---------- 7. coleção do Arena ---------- */
const owned = n => { const C = S.acoll; if (!C) return 0; return C[n] || C[ARN[n]] || C[CARD_ALIAS[(n||'').toLowerCase()]] || 0; };
const preferOwned = () => S.acoll && Object.keys(S.acoll).length && S.acPref !== false;
function renderACollection(){
  const C = S.acoll || {}; const names = Object.keys(C).sort(); const tot = names.reduce((a,n)=>a+C[n],0);
  $('#deckBody').innerHTML = `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));align-items:start">
    <div class="panel stack-v"><h3>Coleção do Arena</h3>
      <p class="muted" style="margin:0">Diga à Academia quais cartas você já tem no MTG Arena. Assim, ao criar ou melhorar um deck, ela prefere as suas cartas e mostra só os curingas que faltam.</p>
      <div class="tip" style="font-size:.9rem"><b>Como trazer a coleção:</b> o Arena não exporta a coleção sozinho. Você pode (1) colar as listas dos decks que já montou no Arena (Decks → Exportar), um de cada vez, ou (2) usar um rastreador como Untapped.gg ou Aetherhub, que exporta a coleção em CSV, e enviar o arquivo aqui.</div>
      <label class="f" for="acTxt">Cole uma lista ou deck do Arena<textarea id="acTxt" rows="7" spellcheck="false" placeholder="4 Llanowar Elves&#10;2 Elfos de Llanowar (FDN) 227"></textarea></label>
      <div class="row-h"><button class="btn primary" id="acAdd">Adicionar à coleção</button><label class="btn" for="acFile" style="cursor:pointer">Enviar arquivo (CSV, Excel, .txt)<input type="file" id="acFile" accept=".csv,.txt,.xlsx,.xls,.ods" hidden></label>${deckCount(deckText) ? '<button class="btn" id="acDeck">Adicionar o deck em uso</button>' : ''}</div>
      <label class="row-h" style="gap:8px"><input type="checkbox" id="acPref" ${S.acPref !== false ? 'checked' : ''}> Preferir minhas cartas ao criar e melhorar decks</label>
      <p class="muted" id="acSt" style="font-size:.9rem"></p></div>
    <div class="panel stack-v"><h3>Minhas cartas no Arena</h3>
      <div class="row-h"><span class="pill">${names.length} cartas diferentes</span><span class="pill">${tot} no total</span>${names.length ? '<button class="btn small" id="acClr">Apagar coleção</button>' : ''}</div>
      ${names.length ? `<input type="text" id="acFind" placeholder="Buscar na coleção…" aria-label="Buscar na coleção"><ul class="ac-coll" id="acList">${names.map(n => `<li data-n="${esc(n.toLowerCase())}"><span>${C[n]}×</span> ${esc(n)}</li>`).join('')}</ul>` : '<p class="muted">Vazia por enquanto.</p>'}</div></div>`;
  const st = m => $('#acSt').textContent = m;
  const addE = async (E, label) => { await resolveImport(E, st); const c = S.acoll = S.acoll || {}; let k = 0; E.forEach(e => { if (!e.en || BASICS.includes(e.en.toLowerCase())) return; c[e.en] = Math.max(c[e.en] || 0, Math.min(4, e.q)); k++; }); save(); renderACollection(); const s2 = $('#acSt'); if (s2) s2.textContent = `${k} carta(s) ${label}.`; };
  $('#acAdd').onclick = () => { const t = $('#acTxt').value; if (t.trim()) addE(parseImport(t), 'adicionadas'); };
  $('#acFile').onchange = async e => { const f = e.target.files[0]; if (!f) return; try { const r = await readImportFile(f); let E; if (r.rows) { E = []; rowsToEntries(r.rows, E); E = group(E); } else E = parseImport(r.text, true); addE(E, 'adicionadas do arquivo'); } catch(err) { st('Não consegui ler o arquivo. Tente salvar como CSV.'); } };
  const ad = $('#acDeck'); if (ad) ad.onclick = () => addE(parseImport(deckText), 'do deck em uso adicionadas');
  $('#acPref').onchange = e => { S.acPref = e.target.checked; save(); };
  const cl = $('#acClr'); if (cl) cl.onclick = () => { if (confirm('Apagar toda a coleção do Arena guardada?')) { S.acoll = {}; save(); renderACollection(); } };
  const fd = $('#acFind'); if (fd) fd.oninput = () => { const q = fold(fd.value); $$('#acList li').forEach(li => li.hidden = q && !fold(li.dataset.n).includes(q)); };
}

/* ---------- mapa da Academia na página inicial ---------- */
const MAP_SEC = [['regras','Regras',[['Manual'],['Habilidades'],['O turno'],['Anatomia da carta']]],['academia','Lições',[['12 lições práticas']]],['quiz','Quiz',[['Perguntas com explicação']]],
  ['treino','Treino',SECTIONS.treino.tabs],['mesa','Na mesa',SECTIONS.mesa.tabs],['formatos','Formatos',[['Commander'],['Padrão'],['Outros formatos'],['Guia do MTG Arena'],['Montador guiado']]],
  ['construir','Construir',SECTIONS.construir.tabs],['decks','Analisar',SECTIONS.decks.tabs],['meus','Meus decks',SECTIONS.meus.tabs],['arena','Arena e coleção',SECTIONS.arena.tabs]];
function mapHTML(){
  return `<div class="panel stack-v amap"><h3>Mapa da Academia</h3><p class="muted" style="margin:0">Tudo o que a Academia tem, num lugar só. Toque para ir direto.</p>
    <div class="amap-g">${MAP_SEC.map(([v,t,tabs]) => `<div class="amap-s" data-sec="${v}"><button class="amap-h" data-mgo="${v}">${t}</button><div class="amap-t">${tabs.map(x => x.length > 1 ? `<button data-mgo="${v}" data-mtab="${x[0]}">${x[1]}</button>` : `<button data-mgo="${v}">${x[0]}</button>`).join('')}</div></div>`).join('')}</div></div>`;
}
(function(){
  const r0 = RENDER.inicio;
  RENDER.inicio = function(){
    r0();
    const sr = $('#v-inicio .statrow'); const html = mapHTML();
    if (sr) sr.insertAdjacentHTML('afterend', html); else $('#v-inicio').insertAdjacentHTML('beforeend', html);
    $$('[data-mgo]').forEach(b => b.onclick = () => { const v = b.dataset.mgo, t = b.dataset.mtab; if (t) { if (SECTIONS[v] && SECTIONS[v].kind === 'tr') trTab = t; else deckTab = t; if (t === 'calc') { show('combate'); return; } } show(v); });
  };
})();
