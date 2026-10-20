/* ================= OTIMIZAR DECK E GERAR DECK (prontos para o MTG Arena) ================= */
const AR_FMT = {standard:'Padrão', historic:'Histórico', timeless:'Timeless', explorer:'Explorer', brawl:'Brawl (100 cartas)', standardbrawl:'Brawl Padrão (60 cartas)'};
const LEG = {};           // nome -> {legal:{...}, arena:bool, an:'nome no Arena'}
const ARN = {};           // nome -> nome usado no Arena
const qCache = {};
const arenaName = c => (c.card_faces && /transform|modal_dfc|adventure|flip/.test(c.layout||'') ? c.card_faces[0].name : c.name);
function regCard(c){
  if (!CARDS[c.name]) { CARDS[c.name] = fromScry(c); CARD_ALIAS[c.name.toLowerCase()] = c.name; }
  if (CARDS[c.name].img) IMG[c.name.toLowerCase()] = CARDS[c.name].img; else { const u = (c.image_uris && c.image_uris.normal) || (c.card_faces && c.card_faces[0].image_uris && c.card_faces[0].image_uris.normal); if (u) IMG[c.name.toLowerCase()] = u; }
  ARN[c.name] = arenaName(c);
  LEG[c.name] = {legal: c.legalities || {}, arena: (c.games||[]).includes('arena'), r: c.rarity, ci: c.color_identity || [], tl: c.type_line || ''};
}
async function fetchQ(q, max){
  if (qCache[q]) return qCache[q];
  const r = await fetch('https://api.scryfall.com/cards/search?order=edhrec&q=' + encodeURIComponent(q), {headers:{'Accept':'application/json'}});
  await new Promise(res => setTimeout(res, 110));
  if (r.status === 404) return qCache[q] = [];
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json(); const L = j.data.slice(0, max || 40); L.forEach(regCard); return qCache[q] = L.map(c => c.name);
}
async function fetchLegal(names){
  const miss = [...new Set(names)].filter(n => !LEG[n] && !BASICS.includes(n.toLowerCase()));
  for (let i = 0; i < miss.length; i += 75) {
    const chunk = miss.slice(i, i+75);
    const r = await fetch('https://api.scryfall.com/cards/collection', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({identifiers: chunk.map(name=>({name}))})});
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json(); j.data.forEach(c => { regCard(c); chunk.forEach(q => { if (q.toLowerCase() === c.name.toLowerCase() || (c.card_faces && c.card_faces[0].name.toLowerCase() === q.toLowerCase())) { LEG[q] = LEG[c.name]; ARN[q] = ARN[c.name]; } }); });
    await new Promise(res => setTimeout(res, 110));
  }
}
const BASIC_OF = {W:'Plains',U:'Island',B:'Swamp',R:'Mountain',G:'Forest'};
function basicsSplit(pips, n, colors){
  const tot = colors.reduce((a,c)=>a+(pips[c]||1),0); const out = {}; let left = n;
  colors.forEach((c,i) => { const k = i === colors.length-1 ? left : Math.round((pips[c]||1)/tot*n); out[BASIC_OF[c]] = Math.max(0,k); left -= k; });
  return out;
}
function arenaList(list, cmd){
  const L = list.filter(e => e.q > 0 && e.name !== cmd).map(e => `${e.q} ${ARN[e.name] || e.name}`);
  return cmd ? `Commander\n1 ${ARN[cmd] || cmd}\n\nDeck\n${L.join('\n')}` : `Deck\n${L.join('\n')}`;
}
const KIND_ORDER = ['creature','planeswalker','instant','sorcery','artifact','enchantment','battle','land','other','unknown'];
function deckGallery(list, cmd, marks){
  const groups = {}; list.forEach(e => { if (!e.q) return; const d = cardData(e.name); const k = e.name === cmd ? 'cmd' : d ? (d.k === 'land' || BASICS.includes(e.name.toLowerCase()) ? 'land' : d.k) : (BASICS.includes(e.name.toLowerCase()) ? 'land' : 'other'); (groups[k] = groups[k] || []).push(e); });
  const label = {cmd:'Comandante', creature:'Criaturas', planeswalker:'Planeswalkers', instant:'Instantâneos', sorcery:'Feitiços', artifact:'Artefatos', enchantment:'Encantamentos', battle:'Batalhas', land:'Terrenos', other:'Outras', unknown:'Outras'};
  return ['cmd', ...KIND_ORDER].filter(k => groups[k]).map(k => `<div class="gal-group"><span class="eyebrow">${label[k]} · ${groups[k].reduce((a,e)=>a+e.q,0)}</span><div class="gal">${groups[k].map(e => `<div class="gal-i">${cardHTML(e.name,{showPt:false, note: marks && marks[e.name] ? marks[e.name] : undefined})}<span class="gal-q">${e.q}×</span></div>`).join('')}</div></div>`).join('');
}
function resultHTML(id, title, list, cmd, extra){
  const txt = arenaList(list, cmd), tot = list.reduce((a,e)=>a+e.q,0);
  return `<div class="panel stack-v" id="${id}"><div class="row-h" style="justify-content:space-between"><h3 style="margin:0">${title}</h3><span class="pill good">${tot} cards</span></div>
    ${extra || ''}
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:start">
      <div class="stack-v"><span class="eyebrow">Lista para importar no MTG Arena</span><pre class="code" id="${id}Txt">${esc(txt)}</pre>
        <div class="row-h"><button class="btn primary" data-copy="${id}">Copiar para o Arena</button><button class="btn" data-toan="${id}">Abrir no Analisador</button><button class="btn" data-tosim="${id}">Simular</button></div>
        <p class="muted" style="font-size:.85rem">No Arena: <b>Decks → Importar</b>. As cartas que você ainda não tem aparecem para criar com curingas.</p></div>
      <div class="stack-v"><span class="eyebrow">Como o deck fica</span>${deckGallery(list, cmd)}</div>
    </div></div>`;
}
function bindResult(id, list, cmd, fmt){
  const txt = arenaList(list, cmd);
  const c = $(`[data-copy="${id}"]`); if (c) c.onclick = () => copyText(txt, $('#'+id+'Txt'));
  const send = () => { deckText = list.map(e => `${e.q} ${e.name}`).join('\n'); deckFormat = /brawl$/.test(fmt) && fmt !== 'standardbrawl' ? '100' : '60'; DECK = null; hand = null; };
  const a = $(`[data-toan="${id}"]`); if (a) a.onclick = () => { send(); deckTab = 'analise'; RENDER.decks(); };
  const s = $(`[data-tosim="${id}"]`); if (s) s.onclick = () => { send(); simSel = 'mine'; trTab = 'sim'; show('treino'); };
}
const RQ = {
  rem:'(t:instant or t:sorcery) (o:"destroy target" or o:"exile target" or o:"damage to target creature" or o:"damage to any target" or o:"target creature gets -")',
  draw:'-t:creature (o:"draw two cards" or o:"draw three cards" or o:"draws two cards" or o:"draw a card for each")',
  ramp:'-t:land (o:"search your library for a basic land" or o:"search your library for up to two basic land" or (t:artifact o:"add {"))',
  wipe:'(o:"destroy all creatures" or o:"exile all creatures" or o:"damage to each creature" or o:"all creatures get -")',
  counter:'o:"counter target spell"',
  cheap:'t:creature mv<=2', mid:'t:creature mv>=3 mv<=4', big:'t:creature mv>=5', fly:'t:creature o:flying mv<=4', trick:'t:instant (o:"gets +" or o:"gain hexproof" or o:"gains indestructible")', cantrip:'(t:instant or t:sorcery) mv<=2 o:"draw a card"'
};
const fmtQ = f => f === 'standardbrawl' ? 'f:standardbrawl' : f === 'brawl' ? 'f:brawl' : `f:${f}`;
const isBig = f => f === 'brawl';
const RAR = {all:'', rare:'r<=rare', unc:'r<=uncommon'};
const RAR_PT = {all:'Qualquer raridade', rare:'Até raras (sem míticas)', unc:'Só comuns e incomuns (economiza curingas)'};

/* ---------------- otimizar o deck importado ---------------- */
let opt = {fmt:null, rar:'all', res:null, busy:false};
function optPanelHTML(){
  const A = ent.A; if (!A) return '';
  const guess = A.fmt === '100' ? 'brawl' : 'standard';
  if (!opt.fmt) opt.fmt = guess;
  return `<div class="sub-h"><h2>Versão otimizada para o Arena</h2><p>A ferramenta mantém o coração do seu deck (sinergias, comandante, cartas com mais cópias), tira cartas fora das cores principais ou inválidas no formato e completa o que falta (remoção, compra, aceleração, curva) com cartas válidas e disponíveis no Arena.</p></div>
   <div class="panel stack-v">
     <div class="grid g2"><label class="f" for="optFmt">Formato no Arena<select id="optFmt">${Object.entries(AR_FMT).map(([k,l])=>`<option value="${k}" ${opt.fmt===k?'selected':''}>${l}</option>`).join('')}</select></label>
     <label class="f" for="optRar">Cartas novas sugeridas<select id="optRar">${Object.entries(RAR_PT).map(([k,l])=>`<option value="${k}" ${opt.rar===k?'selected':''}>${l}</option>`).join('')}</select></label></div>
     <div class="row-h"><button class="btn primary" id="optGo">Gerar versão otimizada</button><span class="muted" id="optSt" style="font-size:.88rem"></span></div>
   </div><div id="optOut" style="margin-top:14px"></div>`;
}
function bindOpt(){
  const f = $('#optFmt'); if (!f) return;
  f.onchange = e => opt.fmt = e.target.value; $('#optRar').onchange = e => opt.rar = e.target.value;
  $('#optGo').onclick = async () => { if (opt.busy) return; opt.busy = true; $('#optGo').disabled = true; const st = m => { const e = $('#optSt'); if (e) e.textContent = m; };
    try { opt.res = await optimizeDeck(st); st('Pronto.'); drawOpt(); } catch(e) { st('Não foi possível consultar o Scryfall agora. Tente de novo em instantes.'); }
    opt.busy = false; const b = $('#optGo'); if (b) b.disabled = false; };
  if (opt.res) drawOpt();
}
function cardRoles(name){ const d = cardData(name); if (!d) return []; const t = (d.x||'') + ' ' + (d.t||''); return ROLE.filter(r => r[2].test(t)).map(r => r[0]); }
async function optimizeDeck(st){
  const A = ent.A, fmt = opt.fmt, big = isBig(fmt), R = A.R;
  const entries = R.entries.filter(e => e.q > 0);
  st('Conferindo validade das cartas no formato e no Arena…');
  await fetchLegal(entries.map(e => e.name));
  // cores principais
  const pipT = Object.entries(R.pips).filter(([,v])=>v).sort((a,b)=>b[1]-a[1]); const totP = pipT.reduce((a,[,v])=>a+v,0);
  let cols = big && A.cmd && LEG[A.cmd] ? LEG[A.cmd].ci.slice() : pipT.filter(([,v],i) => i === 0 || v/totP > .15).map(([c])=>c);
  if (!cols.length) cols = ['C'];
  const colStr = cols.join('').toLowerCase();
  const fmtKey = fmt === 'standardbrawl' ? 'standardbrawl' : fmt;
  const out = [], reasons = {};
  const legalOk = n => { const L = LEG[n]; if (!L) return true; return L.arena && (L.legal[fmtKey] === 'legal' || L.legal[fmtKey] === 'restricted'); };
  const inCols = n => { const L = LEG[n]; const ci = L ? L.ci : []; return ci.every(c => cols.includes(c)); };
  // arquétipo e metas
  const arch = A.arch;
  const total = big ? 100 : fmt === 'standardbrawl' ? 60 : 60;
  const lands = big ? 37 : fmt === 'standardbrawl' ? 24 : Math.max(20, Math.min(26, recLands('60', R.avg)));
  const T = big ? {ramp:10, draw:9, rem:8, wipe:2} : arch === 'Aggro' ? {rem:6, cheapCr:12} : arch === 'Controle' ? {rem:8, draw:6, wipe:2} : arch === 'Ramp' ? {ramp:6, rem:6, draw:3} : {rem:7, draw:3};
  const copies = big || fmt === 'standardbrawl' ? 1 : 4;
  // pontuação das cartas atuais
  const synNames = new Set(); (A.syn||[]).forEach(s => (s.payoffs||[]).forEach(e => synNames.add(e.name)));
  const pool = new Map();
  const score = (n, q, isNew) => { const d = cardData(n); if (!d) return 0; let s = 1; const roles = cardRoles(n);
    if (synNames.has(n)) s += 2; if (A.tribe && new RegExp(A.tribe[0].replace(/s$/,''),'i').test(d.t||'')) s += 1.5;
    if (q >= 3) s += 1; if (roles.length) s += .8; if (/\bvoar\b|flying|ameaçar|menace|atropelar|trample/i.test(d.x||'') && d.k==='creature') s += .4;
    if (arch === 'Aggro' && d.cmc >= 5) s -= 1.5; if (arch === 'Aggro' && d.k==='creature' && d.cmc <= 2) s += .8;
    if (!isNew) s += 1.5; return s; };
  entries.forEach(e => {
    if (e.k === 'land' || BASICS.includes(e.name.toLowerCase())) return;
    if (big && e.name === A.cmd) return;
    if (!legalOk(e.name)) { reasons[e.name] = LEG[e.name] && !LEG[e.name].arena ? 'não existe no Arena' : `não é válida em ${AR_FMT[fmt]}`; return; }
    if (!inCols(e.name)) { reasons[e.name] = 'fora das cores principais do deck'; return; }
    pool.set(e.name, {n:e.name, s:score(e.name, e.q, false), roles:cardRoles(e.name), orig:e.q, isNew:false});
  });
  // candidatos para funções em falta
  const have = role => [...pool.values()].filter(c => c.roles.includes(role)).length * copies;
  const base = `${big ? 'id<=' + colStr : 'c<=' + colStr} ${fmtQ(fmt)} game:arena -t:land ${RAR[opt.rar]}`;
  const need = Object.entries(T).filter(([k,v]) => (k === 'cheapCr' ? [...pool.values()].filter(c => { const d = cardData(c.n); return d && d.k==='creature' && d.cmc<=2; }).length*copies : have(k)) < v);
  for (const [k] of need) {
    st(`Buscando cartas de ${k === 'cheapCr' ? 'criaturas baratas' : (ROLE.find(r=>r[0]===k)||[,k])[1].toLowerCase()}…`);
    const q = k === 'cheapCr' ? RQ.cheap : RQ[k];
    const L = await fetchQ(`${q} ${base}`, 12);
    L.forEach(n => { if (!pool.has(n) && inCols(n)) pool.set(n, {n, s:score(n, 0, true) + .3, roles: cardRoles(n).concat(k==='cheapCr'?['cheapCr']:[k]), orig:0, isNew:true, why:k}); });
  }
  // tema do comandante / tribo para completar decks grandes
  const slotsTotal = total - lands - (big ? 1 : 0);
  const uniquesNeeded = Math.ceil(slotsTotal / copies);
  if (pool.size < uniquesNeeded + 4) {
    st('Completando com cartas do tema do deck…');
    const theme = A.tribe ? `t:${A.tribe[0].replace(/s$/,'').toLowerCase()}` : (A.syn && A.syn[0] ? ({tokens:'o:create o:token', aristo:'o:sacrifice', life:'o:"gain life"', counters:'o:"+1/+1 counter"', spells:'(t:instant or t:sorcery)', grave:'o:graveyard', land:'o:landfall', voltron:'(t:equipment or t:aura)', fly:'o:flying', arts:'t:artifact', ench:'t:enchantment'})[A.syn[0].k] || 't:creature' : 't:creature');
    const L = await fetchQ(`${theme} ${base}`, 60);
    L.forEach(n => { if (!pool.has(n) && inCols(n)) pool.set(n, {n, s:score(n, 0, true), roles:cardRoles(n), orig:0, isNew:true, why:'theme'}); });
  }
  // seleção: primeiro cumpre as metas de cada função, depois a melhor pontuação
  const chosen = new Map(); const sorted = [...pool.values()].sort((a,b)=>b.s-a.s);
  for (const [k,v] of Object.entries(T)) { let got = [...chosen.values()].filter(c => c.roles.includes(k)).length * copies;
    for (const c of sorted) { if (got >= v || chosen.size >= uniquesNeeded) break; if (!chosen.has(c.n) && c.roles.includes(k)) { chosen.set(c.n, c); got += copies; } } }
  for (const c of sorted) { if (chosen.size >= uniquesNeeded) break; if (!chosen.has(c.n)) chosen.set(c.n, c); }
  // cópias
  let spellCount = 0; const sel = [...chosen.values()].sort((a,b)=>b.s-a.s);
  sel.forEach(c => { const left = slotsTotal - spellCount; const k = Math.max(0, Math.min(copies, left)); out.push({name:c.n, q:k}); spellCount += k; });
  // terrenos: não básicos úteis do deck original + básicos
  let landLeft = lands;
  const nb = entries.filter(e => e.k === 'land' && !BASICS.includes(e.name.toLowerCase()) && legalOk(e.name) && inCols(e.name));
  nb.forEach(e => { const k = Math.min(e.q, landLeft, big ? 1 : 4); if (k > 0) { out.push({name:e.name, q:k}); landLeft -= k; } });
  if (big && cols.length >= 2 && !out.some(e=>e.name==='Command Tower') && landLeft > 0) { await fetchLegal(['Command Tower']); if (legalOk('Command Tower')) { out.push({name:'Command Tower', q:1}); landLeft--; } }
  const colsB = cols.filter(c => BASIC_OF[c]);
  Object.entries(basicsSplit(R.pips, landLeft, colsB.length ? colsB : ['W'])).forEach(([n,q]) => { if (q) out.push({name:n, q}); });
  if (big && A.cmd) out.unshift({name:A.cmd, q:1});
  // diferença
  const before = new Map(entries.map(e => [e.name, e.q])), after = new Map(out.map(e => [e.name, e.q]));
  const added = [], removed = [], changed = [];
  after.forEach((q,n) => { const b = before.get(n) || 0; if (!b) added.push({n, q, why: (pool.get(n)||{}).why}); else if (b !== q && !BASICS.includes(n.toLowerCase())) changed.push({n, from:b, to:q}); });
  before.forEach((q,n) => { if (!after.has(n) && !BASICS.includes(n.toLowerCase())) removed.push({n, q, why: reasons[n] || 'pontuação mais baixa: abriu espaço para cartas mais consistentes'}); });
  return {list: out, cmd: big ? A.cmd : null, fmt, added, removed, changed, cols, lands};
}
function drawOpt(){
  const box = $('#optOut'); if (!box || !opt.res) return; const r = opt.res;
  const WHY = {rem:'remoção', draw:'compra de cards', ramp:'aceleração de mana', wipe:'remoção em massa', cheapCr:'curva: criatura barata', theme:'tema do deck'};
  const extra = `<div class="grid g3">
     <div class="panel" style="background:var(--surface-2)"><h3><span class="pill good">${r.added.length}</span> Entram</h3><ul class="dlist2">${r.added.map(a=>`<li>${a.q}× ${cr(a.n)}${a.why?` <span class="muted">(${WHY[a.why]||a.why})</span>`:''}</li>`).join('')||'<li class="muted">nada</li>'}</ul></div>
     <div class="panel" style="background:var(--surface-2)"><h3><span class="pill bad">${r.removed.length}</span> Saem</h3><ul class="dlist2">${r.removed.map(a=>`<li>${a.q}× ${cr(a.n)} <span class="muted">(${esc(a.why)})</span></li>`).join('')||'<li class="muted">nada</li>'}</ul></div>
     <div class="panel" style="background:var(--surface-2)"><h3><span class="pill warn">${r.changed.length}</span> Mudam de quantidade</h3><ul class="dlist2">${r.changed.map(a=>`<li>${cr(a.n)}: ${a.from} → ${a.to}</li>`).join('')||'<li class="muted">nada</li>'}</ul></div></div>
   <p class="muted" style="font-size:.88rem">Cores: ${r.cols.map(manaSym).join('')} · ${r.lands} terrenos · formato ${AR_FMT[r.fmt]}. É uma sugestão automática: jogue algumas partidas e ajuste ao seu gosto.</p>`;
  box.innerHTML = resultHTML('optRes', 'Deck otimizado', r.list, r.cmd, extra);
  bindResult('optRes', r.list, r.cmd, r.fmt);
}

/* ---------------- gerar um deck por perguntas ---------------- */
let gq = {fmt:'standard', cols:[], style:null, tribe:'goblin', rar:'all', exp:'novo', res:null, busy:false};
const GEN_STYLES = [['aggro','Aggro','Atacar rápido com criaturas baratas'],['midrange','Midrange','Criaturas fortes e remoção'],['controle','Controle','Segurar o jogo e vencer tarde'],['voar','Voadores','Vencer pelo ar'],['tribal','Tribal','Um tipo de criatura'],['ramp','Ramp','Acelerar mana para monstros']];
const TRIBES = [['goblin','Goblins'],['elf','Elfos'],['vampire','Vampiros'],['zombie','Zumbis'],['angel','Anjos'],['dragon','Dragões'],['merfolk','Tritões'],['knight','Cavaleiros'],['wizard','Magos'],['cat','Felinos']];
const GEN_RECIPE = {
  aggro:[[16,'cheap'],[8,'mid'],[8,'rem'],[4,'trick']],
  midrange:[[8,'cheap'],[12,'mid'],[4,'big'],[8,'rem'],[4,'draw']],
  controle:[[8,'rem'],[6,'counter'],[3,'wipe'],[7,'draw'],[4,'big'],[6,'cantrip']],
  voar:[[4,'cheap'],[16,'fly'],[8,'rem'],[4,'trick'],[4,'draw']],
  tribal:[[12,'tcheap'],[12,'tmid'],[8,'rem'],[4,'draw']],
  ramp:[[8,'ramp'],[6,'rem'],[4,'draw'],[8,'mid'],[9,'big']]
};
const GEN_RECIPE_C = [[10,'ramp'],[9,'draw'],[8,'rem'],[2,'wipe'],[33,'theme']];
function renderGen(){
  const big = gq.fmt === 'brawl', s60 = !big;
  $('#deckBody').innerHTML = `
   <div class="panel stack-v"><h3>Gerar um deck para mim</h3><p class="muted">Responda as perguntas e receba um deck completo, com as imagens das cartas e a lista pronta para importar no MTG Arena. Só entram cartas válidas no formato escolhido e disponíveis no Arena.</p>
    <div class="wiz-step"><span class="q-t">1. Em qual formato do Arena você vai jogar?</span><div class="pick">${[['standard','Padrão','O mais jogado; coleções recentes'],['historic','Histórico','Coleção maior do Arena'],['standardbrawl','Brawl Padrão','60 cartas, 1 de cada, com comandante'],['brawl','Brawl','100 cartas, 1 de cada, com comandante']].map(([k,l,d])=>`<button data-gf="${k}" aria-pressed="${gq.fmt===k}"><b>${l}</b><small>${d}</small></button>`).join('')}</div></div>
    <div class="wiz-step"><span class="q-t">2. Quais cores?</span><div class="colorpick">${['W','U','B','R','G'].map(c=>`<button data-gc="${c.toLowerCase()}" aria-pressed="${gq.cols.includes(c.toLowerCase())}" style="background:var(--${c.toLowerCase()})" aria-label="${c}">${c}</button>`).join('')}</div>
      <p class="muted" style="font-size:.85rem">Uma ou duas cores deixam o deck mais estável. ${S.myColor?`Sua cor no teste da capa: ${[...S.myColor].map(manaSym).join('')}. <button class="cref" id="gUseMine">Usar</button>`:'Não sabe? Faça o teste "Qual é a sua cor?" na capa.'}</p></div>
    <div class="wiz-step"><span class="q-t">3. Como você gosta de jogar?</span><div class="pick">${GEN_STYLES.filter(s => !big || s[0] !== 'controle').map(([k,l,d])=>`<button data-gs2="${k}" aria-pressed="${gq.style===k}"><b>${l}</b><small>${d}</small></button>`).join('')}</div>
      ${gq.style==='tribal'?`<div class="row-h" style="margin-top:6px">${TRIBES.map(([k,l])=>`<button class="chip" data-gt="${k}" aria-pressed="${gq.tribe===k}">${l}</button>`).join('')}</div>`:''}</div>
    <div class="wiz-step"><span class="q-t">4. Quanto quer gastar em curingas?</span><div class="row-h">${Object.entries(RAR_PT).map(([k,l])=>`<button class="chip" data-gr="${k}" aria-pressed="${gq.rar===k}">${l}</button>`).join('')}</div></div>
    <div class="wiz-step"><span class="q-t">5. Sua experiência</span><div class="row-h">${[['novo','Estou começando'],['medio','Já jogo há algum tempo']].map(([k,l])=>`<button class="chip" data-ge="${k}" aria-pressed="${gq.exp===k}">${l}</button>`).join('')}</div>
      <p class="muted" style="font-size:.85rem">Para quem está começando, o gerador evita cartas de texto muito longo e prefere criaturas e remoções diretas.</p></div>
    <div class="row-h"><button class="btn primary" id="genGo" ${gq.cols.length && gq.style ? '' : 'disabled'}>Gerar deck</button><span class="muted" id="genSt" style="font-size:.88rem">${gq.cols.length && gq.style ? '' : 'Escolha as cores e o estilo.'}</span></div>
   </div><div id="genOut" style="margin-top:14px"></div>`;
  $$('[data-gf]').forEach(b => b.onclick = () => { gq.fmt = b.dataset.gf; if (gq.fmt==='brawl' && gq.style==='controle') gq.style = null; renderGen(); });
  $$('[data-gc]').forEach(b => b.onclick = () => { const c = b.dataset.gc; gq.cols = gq.cols.includes(c) ? gq.cols.filter(x=>x!==c) : [...gq.cols, c].sort((a,b)=>'wubrg'.indexOf(a)-'wubrg'.indexOf(b)); renderGen(); });
  $$('[data-gs2]').forEach(b => b.onclick = () => { gq.style = b.dataset.gs2; renderGen(); });
  $$('[data-gt]').forEach(b => b.onclick = () => { gq.tribe = b.dataset.gt; renderGen(); });
  $$('[data-gr]').forEach(b => b.onclick = () => { gq.rar = b.dataset.gr; renderGen(); });
  $$('[data-ge]').forEach(b => b.onclick = () => { gq.exp = b.dataset.ge; renderGen(); });
  const um = $('#gUseMine'); if (um) um.onclick = () => { gq.cols = [...S.myColor.toLowerCase()].sort((a,b)=>'wubrg'.indexOf(a)-'wubrg'.indexOf(b)); renderGen(); };
  $('#genGo').onclick = async () => { if (gq.busy) return; gq.busy = true; $('#genGo').disabled = true; const st = m => { const e = $('#genSt'); if (e) e.textContent = m; };
    try { gq.res = await generateDeck(st); st('Pronto.'); drawGen(); if (!S.genDone) { S.genDone = true; addXP(30); save(); checkAch(); } }
    catch(e) { st(e && e.message === 'vazio' ? 'Não encontrei cartas suficientes com essas escolhas. Tente outra cor, estilo ou raridade.' : 'Não foi possível consultar o Scryfall agora. Tente de novo em instantes.'); }
    gq.busy = false; const b = $('#genGo'); if (b) b.disabled = false; };
  if (gq.res) drawGen();
}
async function generateDeck(st){
  const fmt = gq.fmt, big = fmt === 'brawl', brawl = /brawl/.test(fmt), copies = brawl ? 1 : 4, col = gq.cols.join('');
  const simple = gq.exp === 'novo' ? '-o:"choose one" -is:dfc' : '';
  const base = `${brawl ? 'id<=' : 'c<='}${col} ${fmtQ(fmt)} game:arena -t:land ${RAR[gq.rar]} ${simple}`;
  const used = new Set(), out = [];
  let cmd = null;
  if (brawl) {
    st('Escolhendo o comandante…');
    const tr = gq.style === 'tribal' ? ` (t:${gq.tribe} or o:${gq.tribe})` : gq.style === 'voar' ? ' o:flying' : '';
    let L = await fetchQ(`is:commander id=${col} ${fmtQ(fmt)} game:arena ${RAR[gq.rar]}${tr}`, 10);
    if (!L.length) L = await fetchQ(`is:commander id=${col} ${fmtQ(fmt)} game:arena`, 10);
    if (!L.length) throw new Error('vazio');
    cmd = L[0]; used.add(cmd);
  }
  const trQ = `t:${gq.tribe}`;
  const recipe = big ? GEN_RECIPE_C : (GEN_RECIPE[gq.style] || GEN_RECIPE.midrange);
  const total = big ? 99 : fmt === 'standardbrawl' ? 59 : 60, lands = big ? 37 : fmt === 'standardbrawl' ? 24 : gq.style === 'aggro' ? 22 : gq.style === 'controle' || gq.style === 'ramp' ? 26 : 24;
  const spells = total - lands;
  const scale = spells / recipe.reduce((a,[n])=>a+n,0);
  let count = 0;
  for (const [nRaw, key] of recipe) {
    const n = Math.round(nRaw * scale);
    let q;
    if (key === 'tcheap') q = `${trQ} t:creature mv<=2`; else if (key === 'tmid') q = `${trQ} t:creature mv>=3`;
    else if (key === 'theme') q = gq.style === 'tribal' ? `${trQ}` : gq.style === 'voar' ? RQ.fly : gq.style === 'aggro' ? RQ.cheap : gq.style === 'ramp' ? RQ.big : 't:creature';
    else q = RQ[key];
    if (gq.style === 'tribal' && (key === 'cheap' || key === 'mid')) q = `${trQ} ${RQ[key]}`;
    st(`Escolhendo cartas: ${({cheap:'criaturas baratas',mid:'criaturas médias',big:'ameaças grandes',rem:'remoção',trick:'truques',draw:'compra de cards',counter:'anulações',wipe:'remoção em massa',cantrip:'mágicas baratas',fly:'voadores',tcheap:'criaturas da tribo',tmid:'criaturas da tribo',ramp:'aceleração',theme:'cartas do tema'})[key]}…`);
    let L = await fetchQ(`${q} ${base}`, 40);
    if (L.length < 2 && key !== 'counter') L = await fetchQ(`${q} ${brawl?'id<=':'c<='}${col} ${fmtQ(fmt)} game:arena -t:land`, 40);
    let got = 0;
    for (const name of L) { if (got >= n || count >= spells) break; if (used.has(name)) continue; const k = Math.min(copies, n - got, spells - count); if (k <= 0) break; used.add(name); out.push({name, q:k}); got += k; count += k; }
  }
  if (count < spells) { // completa com as cartas mais populares nas cores
    st('Completando o deck…'); const L = await fetchQ(`t:creature ${base}`, 80);
    for (const name of L) { if (count >= spells) break; if (used.has(name)) continue; const k = Math.min(copies, spells - count); used.add(name); out.push({name, q:k}); count += k; }
  }
  if (count < spells * .8) throw new Error('vazio');
  // terrenos: duais nas duas cores (se houver) + básicos
  let landLeft = lands + (spells - count);
  if (gq.cols.length >= 2) { st('Escolhendo terrenos…'); const L = await fetchQ(`t:land -t:basic produces=${col} ${fmtQ(fmt)} game:arena ${RAR[gq.rar]}`, 6); for (const n of L.slice(0, brawl ? 6 : 2)) { const k = Math.min(brawl ? 1 : 4, landLeft); if (k) { out.push({name:n, q:k}); landLeft -= k; } } }
  const pips = {}; out.forEach(e => { const p = pips_(cardData(e.name)); for (const c in p) pips[c] = (pips[c]||0) + p[c] * e.q; });
  Object.entries(basicsSplit(pips, landLeft, gq.cols.map(c=>c.toUpperCase()))).forEach(([n,q]) => { if (q) out.push({name:n, q}); });
  if (cmd) out.unshift({name:cmd, q:1});
  return {list: out, cmd, fmt};
}
const pips_ = d => pips(d && d.c);
function drawGen(){
  const box = $('#genOut'); if (!box || !gq.res) return; const r = gq.res;
  const st = GEN_STYLES.find(s=>s[0]===gq.style); const tribe = gq.style === 'tribal' ? ' · ' + TRIBES.find(t=>t[0]===gq.tribe)[1] : '';
  box.innerHTML = resultHTML('genRes', `${st ? st[1] : 'Deck'}${tribe} ${idSyms(gq.cols.join('').toUpperCase())} · ${AR_FMT[r.fmt]}`, r.list, r.cmd,
    `<p class="muted" style="font-size:.88rem">Cartas escolhidas entre as mais populares do Scryfall/EDHREC para cada função, respeitando suas respostas. Gere de novo mudando as opções para ver variações. Depois, use "Entenda seu deck" e o simulador para afinar.</p>`);
  bindResult('genRes', r.list, r.cmd, r.fmt);
}
