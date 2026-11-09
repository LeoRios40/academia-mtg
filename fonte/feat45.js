/* ================= v4.5: RECURSOS NOVOS =================
   2. Estratégias: exemplos que existem no Arena   3. Coleção: cartas novas desde a última vez
   4. Código de transferência                     5. Curingas do Arena
   6. Deck da semana                              7. Treino de mulligan 2.0
   8. Comparar dois decks (números e estratégia)  9. Trilha do Planeswalker
   10. Glossário de gírias do Magic */
S.trail = S.trail || {};
const trailMark = (k, v) => { S.trail = S.trail || {}; if (v === undefined) S.trail[k] = 1; else S.trail[k] = v; save(); };

/* ---------- 2. Estratégias: "No Arena, use…" ---------- */
const ST_ARENA_EX = {};
(function(){
  const rs = renderStrats;
  renderStrats = function(){
    rs();
    if (stOpen) trailMark('estrat');
    const s = stOpen && stByK(stOpen); if (!s || !s.b) return;
    const anchor = [...$$('.st-detail .st-sec')].find(x => /Cartas de exemplo/.test(x.textContent)); if (!anchor) return;
    anchor.insertAdjacentHTML('afterend', `<div class="st-sec st-arena-ex"><b>No MTG Arena, use…</b><p class="muted" style="font-size:.86rem;margin:0">Cartas que existem no Arena e fazem o mesmo papel (as mais usadas pelos jogadores).</p><div class="st-ex" id="stArenaEx"><span class="muted">Procurando cartas do Arena…</span></div></div>`);
    const fill = L => { const el = $('#stArenaEx'); if (!el) return; el.innerHTML = L.length ? L.map(n => cardHTML(n, {showPt:false})).join('') : '<span class="muted">Não encontrei agora. Tente de novo com internet.</span>'; };
    if (ST_ARENA_EX[s.k]) return fill(ST_ARENA_EX[s.k]);
    let q = s.b.tribal ? `t:${(asd.a && asd.a.tribe) || 'elf'} t:creature` : s.b.q;
    fetchQ(`(${q}) game:arena -t:basic`, 40).then(L => { const names = (L || []).filter(n => n && !s.ex.includes(n)).slice(0, 8); ST_ARENA_EX[s.k] = names; fill(names); }).catch(() => fill([]));
  };
})();

/* ---------- 3. Coleção do Arena: cartas novas ---------- */
function acollDiff(){
  const A = S.acoll || {}, P = S.acollSnap; if (!P) return null;
  const add = []; let tot = 0;
  Object.keys(A).forEach(n => { const d = (A[n] || 0) - (P.c[n] || 0); if (d > 0){ add.push([n, d]); tot += d; } });
  return add.length ? {add: add.sort((a, b) => b[1] - a[1]), tot, when: P.d} : null;
}
function acollSnap(){ S.acollSnap = {d: today(), c: Object.assign({}, S.acoll || {})}; save(); }
(function(){
  const rc = renderACollection;
  renderACollection = function(){
    rc();
    if (!S.acollSnap){ if (Object.keys(S.acoll || {}).length) acollSnap(); return; }
    const D = acollDiff(), h = $('#deckBody .panel > h3'); if (!D || !h || $('#acNew')) return;
    h.insertAdjacentHTML('afterend', `<div class="ac-new" id="acNew"><b>✨ ${D.tot} carta${D.tot > 1 ? 's' : ''} nova${D.tot > 1 ? 's' : ''} desde ${esc(D.when)}</b><span class="muted">${D.add.length} diferente${D.add.length > 1 ? 's' : ''}</span>
      <div class="ac-new-l">${D.add.slice(0, 40).map(([n, d]) => `<span class="pill">+${d} ${esc(n)}</span>`).join('')}${D.add.length > 40 ? `<span class="muted">e mais ${D.add.length - 40}…</span>` : ''}</div>
      <div class="row-h"><button class="btn small primary" id="acNewDeck">Criar um deck com as novidades</button><button class="btn small" id="acNewOk">Marcar como visto</button></div></div>`);
    $('#acNewOk').onclick = () => { acollSnap(); $('#acNew').remove(); };
    $('#acNewDeck').onclick = () => { acollSnap(); anStart(); };
  };
})();

/* ---------- 4. Código de transferência ---------- */
async function tfEncode(){
  const txt = JSON.stringify(S), bytes = new TextEncoder().encode(txt);
  let out, pre = 'AP0.';
  if (window.CompressionStream){ try { const cs = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip')); out = new Uint8Array(await new Response(cs).arrayBuffer()); pre = 'AP1.'; } catch(e){ out = bytes; } } else out = bytes;
  let bin = ''; for (let i = 0; i < out.length; i += 8192) bin += String.fromCharCode.apply(null, out.subarray(i, i + 8192));
  return pre + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function tfDecode(code){
  code = String(code || '').trim().replace(/^.*#transfer=/, ''); const m = /^AP([01])\.([A-Za-z0-9_-]+)$/.exec(code); if (!m) throw new Error('formato');
  const b64 = m[2].replace(/-/g, '+').replace(/_/g, '/'), bin = atob(b64 + '==='.slice((b64.length + 3) % 4)), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  let bytes = u; if (m[1] === '1'){ const ds = new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip')); bytes = new Uint8Array(await new Response(ds).arrayBuffer()); }
  return JSON.parse(new TextDecoder().decode(bytes));
}
function tfSummary(D){ return {decks:(D.lib || []).length, acoll:Object.keys(D.acoll || {}).length, coll:parseDeck(D.coll || '').length, xp:D.xp || 0}; }
function tfMerge(D, replace){
  if (replace){ Object.keys(S).forEach(k => delete S[k]); Object.assign(S, D); save(); return; }
  const ids = new Set((S.lib || []).map(d => d.id)); S.lib = (S.lib || []).concat((D.lib || []).filter(d => !ids.has(d.id)));
  S.acoll = S.acoll || {}; Object.entries(D.acoll || {}).forEach(([n, q]) => { S.acoll[n] = Math.max(S.acoll[n] || 0, q); });
  if ((D.coll || '').length > (S.coll || '').length) S.coll = D.coll;
  S.xp = Math.max(S.xp || 0, D.xp || 0); S.done = Object.assign({}, D.done || {}, S.done || {}); S.trail = Object.assign({}, D.trail || {}, S.trail || {});
  if (D.survMeta){ const a = S.survMeta || {cen:0}, b = D.survMeta; S.survMeta = Object.assign({}, b, a, {cen:Math.max(a.cen || 0, b.cen || 0)}); }
  ['wish', 'wild', 'prOwn'].forEach(k => { if (D[k] && !S[k]) S[k] = D[k]; });
  save();
}
let tfIncoming = (function(){ const h = location.hash || ''; if (h.indexOf('#transfer=') !== 0) return null; const c = h.slice(10); try { history.replaceState(null, '', location.pathname + location.search + '#meus'); } catch(e){} deckTab = 'transfer'; return c; })();
function renderTransfer(){
  $('#deckBody').innerHTML = `<div class="grid g2" style="align-items:start">
    <div class="panel stack-v"><h3>Levar para outro aparelho</h3><p class="muted" style="margin:0">Gera um código com tudo o que está nesta Academia: decks, coleções, progresso e o jogo. Mande para você mesmo (WhatsApp, e-mail) e abra no outro aparelho. Não precisa de conta.</p>
      <button class="btn primary" id="tfGen" style="align-self:flex-start">Gerar código</button><div id="tfOut"></div></div>
    <div class="panel stack-v"><h3>Receber de outro aparelho</h3><p class="muted" style="margin:0">Cole o código (ou abra o link) que você gerou no outro aparelho.</p>
      <textarea id="tfIn" rows="5" spellcheck="false" placeholder="AP1.…">${esc(tfIncoming || '')}</textarea><button class="btn" id="tfRead" style="align-self:flex-start">Ler código</button><div id="tfPrev"></div></div></div>`;
  $('#tfGen').onclick = async () => { const o = $('#tfOut'); o.innerHTML = '<span class="muted">Gerando…</span>'; try { const c = await tfEncode(), link = SITE + '#transfer=' + c, sm = tfSummary(S);
    o.innerHTML = `<p style="margin:0">Código pronto: ${sm.decks} decks, ${sm.acoll} cartas do Arena, ${sm.coll} cartas físicas. <span class="muted">(${Math.round(c.length / 1024)} KB de texto)</span></p><textarea readonly rows="4" id="tfCode">${c}</textarea>
      <div class="row-h"><button class="btn small primary" id="tfCopy">Copiar código</button>${c.length < 60000 ? '<button class="btn small" id="tfLink">Copiar link</button>' : ''}${navigator.share ? '<button class="btn small" id="tfShare">Compartilhar</button>' : ''}</div>
      <small class="muted">No outro aparelho: abra o link, ou vá em Meus decks → Levar para outro aparelho → cole o código.</small>`;
    $('#tfCopy').onclick = () => navigator.clipboard.writeText(c).then(() => toast('Código copiado.'), () => { $('#tfCode').select(); document.execCommand('copy'); toast('Código copiado.'); });
    const L = $('#tfLink'); if (L) L.onclick = () => navigator.clipboard.writeText(link).then(() => toast('Link copiado.'));
    const sh = $('#tfShare'); if (sh) sh.onclick = () => navigator.share({title:'Academia do Planeswalker', text:'Meus dados da Academia', url: c.length < 60000 ? link : undefined}).catch(() => {});
    trailMark('transfer'); } catch(e){ o.innerHTML = '<p class="muted">Não consegui gerar o código neste navegador.</p>'; } };
  const read = async () => { const p = $('#tfPrev'); try { const D = await tfDecode($('#tfIn').value), sm = tfSummary(D);
    p.innerHTML = `<div class="tip">O código traz <b>${sm.decks} decks</b>, <b>${sm.acoll} cartas do Arena</b>, ${sm.coll} cartas físicas e ${sm.xp} de experiência.</div>
      <div class="row-h"><button class="btn primary" id="tfMerge">Juntar com o que tenho</button><button class="btn" id="tfRep">Substituir tudo</button></div><small class="muted">Juntar mantém tudo deste aparelho e acrescenta o que vier no código. Substituir apaga o que está aqui.</small>`;
    $('#tfMerge').onclick = () => { tfMerge(D, false); tfIncoming = null; toast('Dados juntados!'); trailMark('transfer'); renderTransfer(); };
    $('#tfRep').onclick = e => { if (!e.target.dataset.sure){ e.target.dataset.sure = 1; e.target.textContent = 'Toque de novo para confirmar'; return; } tfMerge(D, true); tfIncoming = null; toast('Dados substituídos.'); location.reload(); };
  } catch(e){ p.innerHTML = '<p class="muted">Código inválido ou incompleto. Copie o código inteiro de novo.</p>'; } };
  $('#tfRead').onclick = read; if (tfIncoming) read();
}

/* ---------- 5. Curingas do Arena ---------- */
const WR = {common:'Comum', uncommon:'Incomum', rare:'Rara', mythic:'Mítica'};
const WKEY = {common:'c', uncommon:'u', rare:'r', mythic:'m'};
async function wildCalc(entries, singleton){
  const own = S.acoll || {}, need = {c:0, u:0, r:0, m:0}, miss = {c:[], u:[], r:[], m:[]};
  const L = entries.filter(e => !isBasic(e.name)), names = L.map(e => CARD_ALIAS[e.name.toLowerCase()] || e.name);
  for (let i = 0; i < names.length; i += 75){ try { await fetchLegal(names.slice(i, i + 75)); } catch(e){} }
  L.forEach((e, i) => { const n = names[i], q = singleton ? 1 : Math.min(4, e.q), have = own[n] || 0, f = Math.max(0, q - have); if (!f) return; const r = WKEY[(LEG[n] || {}).r] || ((LEG[n] || {}).r ? 'r' : 'u'); need[r] += f; miss[r].push([n, f]); });
  return {need, miss, hasColl: Object.keys(own).length > 0};
}
function wildHTML(W){
  const have = S.wild || {c:0, u:0, r:0, m:0}, ok = ['c', 'u', 'r', 'm'].every(k => (have[k] || 0) >= W.need[k]), tot = ['c', 'u', 'r', 'm'].reduce((a, k) => a + W.need[k], 0);
  const lack = ['m', 'r', 'u', 'c'].filter(k => W.need[k] > (have[k] || 0)).map(k => `${W.need[k] - (have[k] || 0)} ${({c:'comum', u:'incomum', r:'raro', m:'mítico'})[k]}${W.need[k] - (have[k] || 0) > 1 ? 's' : ''}`);
  return `<div class="wc-res">${!W.hasColl ? '<div class="tip">Cadastre a sua coleção do Arena (Arena e coleção → Vincular a conta do Arena) para a conta descontar as cartas que você já tem.</div>' : ''}
    <div class="wc-grid">${['m', 'r', 'u', 'c'].map(k => `<div class="wc-b wc-${k}"><span class="wc-ic"></span><b>${W.need[k]}</b><small>${({c:'Comuns', u:'Incomuns', r:'Raros', m:'Míticos'})[k]}</small><small class="muted">você tem ${have[k] || 0}</small></div>`).join('')}</div>
    <div class="wc-st ${tot === 0 ? 'ok' : ok ? 'ok' : 'no'}">${tot === 0 ? '✓ Você já tem todas as cartas deste deck!' : ok ? `✓ Dá para montar agora: use ${tot} curinga${tot > 1 ? 's' : ''}.` : `Faltam ${lack.join(', ')} para montar tudo.`}</div>
    ${tot ? `<details><summary>Cartas que faltam</summary>${['m', 'r', 'u', 'c'].filter(k => W.miss[k].length).map(k => `<p style="margin:6px 0 0"><b>${({c:'Comuns', u:'Incomuns', r:'Raras', m:'Míticas'})[k]}:</b> ${W.miss[k].map(([n, f]) => `${f}× ${esc(n)}`).join(', ')}</p>`).join('')}</details>` : ''}
    <small class="muted">Raridades segundo o Scryfall (algumas cartas têm raridade diferente no Arena).</small></div>`;
}
function wildInputsHTML(){ const h = S.wild || {}; return `<div class="wc-in"><b>Seus curingas</b><small class="muted">Veja no Arena (canto da tela Decks) ou no seu perfil do Untapped, em "Curingas disponíveis".</small>
  <div class="row-h">${['c', 'u', 'r', 'm'].map(k => `<label class="wc-l wc-${k}"><span class="wc-ic"></span>${({c:'Comuns', u:'Incomuns', r:'Raros', m:'Míticos'})[k]}<input type="number" min="0" max="999" data-wc="${k}" value="${h[k] || 0}"></label>`).join('')}</div></div>`; }
function bindWildInputs(after){ $$('[data-wc]').forEach(i => i.onchange = () => { S.wild = S.wild || {}; S.wild[i.dataset.wc] = Math.max(0, +i.value || 0); save(); after && after(); }); }
function renderWild(){
  const libs = S.lib || [];
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Curingas do Arena</h3><p class="muted" style="margin:0">Quantos curingas de cada raridade você precisa para montar um deck no Arena, já descontando as cartas da sua coleção.</p>
    ${wildInputsHTML()}
    <label class="f">Qual deck?<select id="wcSrc"><option value="deck">Deck em uso (${deckCount(deckText)} cartas)</option>${asd && asd.res ? '<option value="gen">Último deck criado no Criar deck do zero</option>' : ''}${libs.map(d => `<option value="lib:${d.id}">${esc(d.name)}</option>`).join('')}</select></label>
    <label class="chk" style="border:0"><input type="checkbox" id="wcSing"><span>Deck de Brawl (1 cópia de cada)</span></label>
    <button class="btn primary" id="wcGo" style="align-self:flex-start">Calcular curingas</button><div id="wcOut"></div></div>`;
  const go = async () => { const v = $('#wcSrc').value; let txt = deckText, sing = $('#wcSing').checked;
    if (v === 'gen' && asd.res){ txt = arenaList(asd.res.list, asd.res.cmd); sing = sing || !!asd.res.cmd; } else if (v.startsWith('lib:')){ const D = libs.find(d => d.id === v.slice(4)); if (D){ txt = D.versions[D.versions.length - 1].text; sing = sing || !!(D.cmd); } }
    const E = parseDeck(txt); if (!E.length){ $('#wcOut').innerHTML = '<p class="muted">Esse deck está vazio.</p>'; return; }
    $('#wcOut').innerHTML = '<span class="muted">Conferindo as cartas…</span>'; const W = await wildCalc(E, sing); $('#wcOut').innerHTML = wildHTML(W); trailMark('wild'); };
  $('#wcGo').onclick = go; bindWildInputs(() => { if ($('#wcOut .wc-res')) go(); });
}
/* curingas no resultado do Criar deck do zero (formatos do Arena) */
(function(){
  const ba = bindAssist;
  bindAssist = function(){ ba.apply(this, arguments);
    if (asd.step !== 5 || !asd.res || !AF[asd.fmt] || !AF[asd.fmt].arena || $('#wcAs')) return;
    const box = $('.an-done') || $('#asBody .panel') || $('#asBody'); if (!box) return;
    box.insertAdjacentHTML(box.classList && box.classList.contains('an-done') ? 'beforeend' : 'afterbegin', `<div id="wcAs" class="wc-as"><button class="btn small" id="wcAsGo">Quantos curingas preciso?</button><div id="wcAsOut"></div></div>`);
    $('#wcAsGo').onclick = async () => { const o = $('#wcAsOut'); o.innerHTML = '<span class="muted">Conferindo…</span>'; const W = await wildCalc(parseDeck(arenaList(asd.res.list, asd.res.cmd)), !!asd.res.cmd); o.innerHTML = wildInputsHTML() + wildHTML(W); bindWildInputs(() => { o.querySelector('.wc-res').outerHTML = wildHTML(W); }); trailMark('wild'); };
  };
})();

/* ---------- 6. Deck da semana ---------- */
function weekKey(d){ d = d || new Date(); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = t.getUTCFullYear(), w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7); return y + '-S' + w; }
function weekStrat(){ const L = STRATS.filter(s => s.b), k = weekKey(); let h = 0; for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return L[h % L.length]; }
function weekHTML(compact){
  const s = weekStrat(), done = (S.trail.week || {})[weekKey()], has = Object.keys(S.acoll || {}).length;
  return `<div class="wk-card"><span class="wk-tag">Deck da semana</span><div class="wk-h"><b>${s.n}</b><span>${stPips(s.cols)}</span>${done ? '<span class="pill good">✓ montado</span>' : ''}</div>
    <p>${s.o}</p>${compact ? '' : `<p class="muted" style="font-size:.88rem">${s.v}</p>`}
    <div class="row-h">${has ? `<button class="btn small primary" data-wk="arena">Montar com as minhas cartas do Arena</button>` : `<button class="btn small primary" data-wk="arenaAny">Montar para o Arena</button>`}<button class="btn small" data-wk="ver">Ver a estratégia</button></div>
    <small class="muted">Toda segunda-feira muda a estratégia.</small></div>`;
}
function bindWeek(){ $$('[data-wk]').forEach(b => b.onclick = () => { const s = weekStrat(), m = b.dataset.wk;
  if (m === 'ver'){ stOpen = s.k; deckTab = 'estrat'; show('construir'); return; }
  S.trail.week = S.trail.week || {}; S.trail.week[weekKey()] = 1; trailMark('weekDone');
  stBuild(s.k, {own: m === 'arena' ? 'arena' : null, arena: true}); }); }
(function(){
  const rc = renderACollection;
  renderACollection = function(){ rc(); const a = $('#deckBody .an-card'); if (a && !$('#deckBody .wk-card')){ a.insertAdjacentHTML('afterend', weekHTML(true)); bindWeek(); } };
})();

/* ---------- 7. Treino de mulligan 2.0 ---------- */
let mg2 = null;
function mgDeck(src){
  let txt = deckText; if (src && src.startsWith('lib:')){ const D = (S.lib || []).find(d => d.id === src.slice(4)); if (D) txt = D.versions[D.versions.length - 1].text; }
  const A = analyze(parseDeck(txt)); return A;
}
function landCols(c){ const d = cardData(c.name) || {}, x = (d.x || '') + ' ' + (d.t || ''); const out = new Set(); (x.match(/\{([WUBRG])\}/g) || []).forEach(m => out.add(m[1])); if (/any color|qualquer cor/i.test(x)) 'WUBRG'.split('').forEach(k => out.add(k)); const basic = {Plains:'W', Island:'U', Swamp:'B', Mountain:'R', Forest:'G'}[c.name]; if (basic) out.add(basic); return out; }
function spellCols(c){ const d = cardData(c.name) || {}; return new Set(((d.c || '').match(/[WUBRG]/g) || [])); }
function mgEval(cards, n, onPlay){
  const lands = cards.filter(c => c.k === 'land'), spells = cards.filter(c => c.k !== 'land'), L = lands.length;
  const src = new Set(); lands.forEach(l => landCols(l).forEach(k => src.add(k)));
  const castT3 = spells.filter(c => (c.cmc || 0) <= Math.min(3, L + (onPlay ? 0 : 1)) && [...spellCols(c)].every(k => src.has(k))).length;
  const offCol = spells.filter(c => [...spellCols(c)].some(k => !src.has(k))).length;
  const why = []; let score = 0;
  if (L <= 1){ why.push(`Só ${L} terreno${L === 1 ? '' : 's'}: grande risco de não jogar nada.`); score -= 3; }
  else if (L === 2){ why.push(`2 terrenos: ${onPlay ? 'jogando primeiro, é arriscado' : 'comprando primeiro, você ganha uma carta extra: dá para manter'} se houver jogadas baratas.`); score += onPlay ? -.5 : .5; }
  else if (L <= 4){ why.push(`${L} terrenos: quantidade ideal.`); score += 2; }
  else { why.push(`${L} terrenos: pouca ação na mão.`); score -= L >= 6 ? 3 : 1; }
  if (castT3 >= 2){ why.push(`${castT3} mágicas jogáveis até o turno 3: bom começo.`); score += 1.5; } else if (castT3 === 1){ why.push('Só 1 mágica jogável até o turno 3: começo lento.'); score -= .3; } else { why.push('Nada para jogar nos primeiros turnos.'); score -= 1.5; }
  if (offCol >= 2){ why.push(`${offCol} mágicas de cores que os seus terrenos não produzem.`); score -= 1; }
  if (n <= 6){ why.push(`Você já está com ${n} cartas: mãos menores pedem tolerância.`); score += (7 - n) * 1.2; }
  return {keep: score >= 1, why, score};
}
renderMull = function(box){
  box = box || $('#trBody'); const libs = S.lib || [];
  if (!mg2) mg2 = {src:'deck', play:true, n:7, cur:null, ans:null, bottom:new Set(), stage:'decide', tot:0, ok:0, streak:0, best:(S.trail.mullBest || 0)};
  const A = mgDeck(mg2.src);
  if (A.names.length < 20){ box.innerHTML = `<div class="panel stack-v"><h3>Treino de mulligan</h3><p class="muted">Precisa de um deck com pelo menos 20 cartas. Importe um deck ou escolha um salvo.</p>${libs.length ? `<select id="mgSrc"><option value="deck">Deck em uso</option>${libs.map(d => `<option value="lib:${d.id}">${esc(d.name)}</option>`).join('')}</select>` : '<button class="btn primary" id="mgImp">Importar deck</button>'}</div>`; const s = $('#mgSrc'); if (s) s.onchange = () => { mg2.src = s.value; mg2.cur = null; renderMull(box); }; const ib = $('#mgImp'); if (ib) ib.onclick = () => { deckTab = 'importar'; show('meus'); }; return; }
  if (!mg2.cur){ mg2.cur = shuffled(A.names).slice(0, 7); mg2.ans = null; mg2.bottom = new Set(); mg2.stage = 'decide'; }
  const ev = mgEval(mg2.cur, mg2.n, mg2.play), need = 7 - mg2.n;
  box.innerHTML = `<div class="panel stack-v mg2"><div class="row-h" style="justify-content:space-between"><h3 style="margin:0">Treino de mulligan</h3><span class="pill">${mg2.tot} mãos · ${mg2.tot ? Math.round(mg2.ok / mg2.tot * 100) : 0}% de acerto · sequência ${mg2.streak} (recorde ${mg2.best})</span></div>
    <div class="row-h"><select id="mgSrc" aria-label="Deck"><option value="deck">Deck em uso</option>${libs.map(d => `<option value="lib:${d.id}" ${mg2.src === 'lib:' + d.id ? 'selected' : ''}>${esc(d.name)}</option>`).join('')}</select>
      <div class="seg"><button class="chip" data-mgp="1" aria-pressed="${mg2.play}">Jogando primeiro</button><button class="chip" data-mgp="0" aria-pressed="${!mg2.play}">Comprando primeiro</button></div></div>
    <p class="muted" style="margin:0">${mg2.stage === 'bottom' ? `Mulligan de Londres: você comprou 7 de novo. <b>Escolha ${need} carta${need > 1 ? 's' : ''} para colocar no fundo do grimório.</b>` : `Mão de <b>${mg2.n}</b> cartas${mg2.n < 7 ? ' (depois de mulligan)' : ''}. Você ${mg2.play ? 'joga primeiro (não compra no turno 1)' : 'compra primeiro (compra no turno 1)'}.`}</p>
    <div class="hand-row mg2-hand">${mg2.cur.map((c, i) => `<div class="mg2-c ${mg2.bottom.has(i) ? 'out' : ''}" data-mgi="${i}">${cardHTML(c.name, {showPt:false})}</div>`).join('')}</div>
    ${mg2.stage === 'bottom' ? `<button class="btn primary" id="mgBot" ${mg2.bottom.size === need ? '' : 'disabled'}>Colocar no fundo (${mg2.bottom.size}/${need})</button>` :
      mg2.ans == null ? `<div class="row-h"><button class="btn primary" data-mg2="keep">Manter</button><button class="btn" data-mg2="mull" ${mg2.n <= 4 ? 'disabled' : ''}>Mulligan</button></div>` :
      `<div class="why ${mg2.ans === (ev.keep ? 'keep' : 'mull') ? 'ok' : 'no'}"><b>${mg2.ans === (ev.keep ? 'keep' : 'mull') ? 'Boa decisão!' : 'Eu faria diferente:'}</b> ${ev.keep ? 'eu manteria.' : 'eu faria mulligan.'}<ul>${ev.why.map(w => `<li>${w}</li>`).join('')}</ul></div>
       <div class="row-h">${mg2.ans === 'mull' && mg2.n > 4 ? '<button class="btn primary" id="mgDo">Fazer o mulligan</button>' : ''}<button class="btn ${mg2.ans === 'mull' ? '' : 'primary'}" id="mgNext">Nova mão de 7</button></div>`}
    <details class="g3-help"><summary>Como decidir</summary><ul><li>Quase sempre mantenha 2 a 4 terrenos com jogadas baratas.</li><li>Jogando primeiro você não compra no turno 1: mãos com 2 terrenos ficam mais arriscadas.</li><li>Confira as cores: terrenos que não pagam as suas mágicas valem menos.</li><li>Mulligan de Londres: compre 7 de novo e coloque 1 carta no fundo para cada mulligan.</li></ul></details></div>`;
  $('#mgSrc').onchange = e => { mg2.src = e.target.value; mg2.cur = null; mg2.n = 7; renderMull(box); };
  $$('[data-mgp]').forEach(b => b.onclick = () => { mg2.play = b.dataset.mgp === '1'; renderMull(box); });
  $$('[data-mg2]').forEach(b => b.onclick = () => { mg2.ans = b.dataset.mg2; mg2.tot++; const right = mg2.ans === (ev.keep ? 'keep' : 'mull'); if (right){ mg2.ok++; mg2.streak++; sfx('ok'); } else { mg2.streak = 0; sfx('no'); } if (mg2.streak > mg2.best){ mg2.best = mg2.streak; S.trail.mullBest = mg2.best; } S.trail.mull = (S.trail.mull || 0) + 1; save(); renderMull(box); });
  const dn = $('#mgDo'); if (dn) dn.onclick = () => { mg2.n--; mg2.cur = shuffled(A.names).slice(0, 7); mg2.ans = null; mg2.bottom = new Set(); mg2.stage = 'bottom'; renderMull(box); };
  const nx = $('#mgNext'); if (nx) nx.onclick = () => { mg2.n = 7; mg2.cur = null; renderMull(box); };
  if (mg2.stage === 'bottom'){ $$('[data-mgi]').forEach(d => d.onclick = e => { e.preventDefault(); e.stopPropagation(); const i = +d.dataset.mgi; if (mg2.bottom.has(i)) mg2.bottom.delete(i); else if (mg2.bottom.size < need) mg2.bottom.add(i); renderMull(box); });
    const bt = $('#mgBot'); if (bt) bt.onclick = () => { mg2.cur = mg2.cur.filter((_, i) => !mg2.bottom.has(i)); mg2.bottom = new Set(); mg2.stage = 'decide'; renderMull(box); }; }
};

/* ---------- 8. Comparar dois decks: números e estratégia ---------- */
function stScoreNames(E){
  const names = Object.keys(E), tot = names.reduce((a, n) => a + E[n], 0) || 1;
  return STRATS.filter(s => s.b && !s.b.tribal).map(s => { const q = names.filter(n => stCardMatch(s, n)).reduce((a, n) => a + E[n], 0); return [s, q / tot]; }).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 2);
}
async function cmpStats(txt){
  const E = parseDeck(txt), M = {}; E.forEach(e => { const n = CARD_ALIAS[e.name.toLowerCase()] || e.name; M[n] = (M[n] || 0) + e.q; });
  const nb = Object.keys(M).filter(n => !isBasic(n)); for (let i = 0; i < nb.length; i += 75){ try { await fetchLegal(nb.slice(i, i + 75)); } catch(e){} }
  const A = analyze(E); return {A, M, st: stScoreNames(M)};
}
function cmpCol(T, X){
  const A = X.A, avg = A.nonland ? (A.cmcSum / A.nonland).toFixed(2) : '—', mx = Math.max(1, ...A.curve.map(c => c.cr + c.ot));
  const cols = Object.entries(A.pips).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  return `<div class="panel stack-v cmp2-c"><h3 style="margin:0">${T}</h3>
    <div class="cmp2-n"><span><b>${A.total}</b>cartas</span><span><b>${A.lands}</b>terrenos</span><span><b>${avg}</b>custo médio</span></div>
    <div class="cmp2-curve">${A.curve.map((c, i) => `<span title="Custo ${i}${i === 7 ? '+' : ''}: ${c.cr + c.ot}"><i style="height:${Math.round((c.cr + c.ot) / mx * 100)}%"></i><small>${i}${i === 7 ? '+' : ''}</small></span>`).join('')}</div>
    <div><b>Cores:</b> ${cols.length ? cols.map(([k, v]) => `${manaSym(k)} ${v}`).join(' ') : 'incolor'}</div>
    <div><b>Estratégia:</b> ${X.st.length ? X.st.map(([s, p]) => `<button class="link-btn" data-stopen2="${s.k}">${s.n}</button> <span class="muted">(${Math.round(p * 100)}%)</span>`).join(' · ') : '<span class="muted">não identificada</span>'}</div></div>`;
}
(function(){
  const rc = renderCompare;
  renderCompare = function(){
    rc(); const libs = S.lib || [], opts = `<option value="">Escolher…</option><option value="deck">Deck em uso</option>${libs.map(d => `<option value="lib:${d.id}">${esc(d.name)}</option>`).join('')}`;
    $('#deckBody').insertAdjacentHTML('afterbegin', `<div class="panel stack-v cmp2" style="margin-bottom:14px"><h3>Comparar dois decks</h3><p class="muted" style="margin:0">Escolha dois decks (ou cole as listas abaixo) para ver lado a lado curva de mana, cores, terrenos e a estratégia de cada um.</p>
      <div class="row-h"><label class="f">Deck A<select id="cmpSa">${opts}</select></label><label class="f">Deck B<select id="cmpSb">${opts}</select></label><button class="btn primary" id="cmpGo" style="align-self:flex-end">Comparar números</button></div><div id="cmp2Out"></div></div>`);
    const txtOf = v => v === 'deck' ? deckText : v.startsWith('lib:') ? ((D => D ? D.versions[D.versions.length - 1].text : '')((S.lib || []).find(d => d.id === v.slice(4)))) : '';
    ['a', 'b'].forEach(x => $('#cmpS' + x).onchange = e => { const t = txtOf(e.target.value); if (!t) return; const ta = $(x === 'a' ? '#cmpA' : '#cmpB'); ta.value = t; ta.dispatchEvent(new Event('input')); });
    $('#cmpGo').onclick = async () => { const a = $('#cmpA').value, b = $('#cmpB').value, o = $('#cmp2Out'); if (!parseDeck(a).length || !parseDeck(b).length){ o.innerHTML = '<p class="muted">Escolha ou cole os dois decks.</p>'; return; }
      o.innerHTML = '<span class="muted">Lendo as cartas…</span>'; const [X, Y] = await Promise.all([cmpStats(a), cmpStats(b)]);
      const common = Object.keys(X.M).filter(n => Y.M[n]).length;
      o.innerHTML = `<div class="grid g2" style="align-items:start">${cmpCol('Deck A', X)}${cmpCol('Deck B', Y)}</div><p class="muted" style="margin:8px 0 0">${common} cartas em comum.</p>`;
      $$('[data-stopen2]').forEach(bt => bt.onclick = () => { stOpen = bt.dataset.stopen2; deckTab = 'estrat'; show('construir'); });
      trailMark('cmp'); };
  };
})();

/* ---------- 10. Glossário de gírias ---------- */
const GLOSS = [
  ['ETB','Enters the battlefield: "quando entra no campo de batalha". Efeitos que acontecem quando a permanente entra.','"Essa criatura tem um ETB que compra uma carta."'],
  ['LTB','Leaves the battlefield: "quando sai do campo de batalha".','"O LTB dela devolve a carta exilada."'],
  ['Tutor','Carta que procura outra carta específica no grimório.','"Usei um tutor para achar a peça do combo."'],
  ['Cantrip','Mágica barata que, além do efeito, compra uma carta (Opt, Ponder).','"Esse deck tem muitos cantrips para achar respostas."'],
  ['Board wipe / Wrath','Remoção em massa: destrói todas (ou quase todas) as criaturas.','"Segurei as criaturas porque ele tinha cara de ter wrath."'],
  ['Topdeck','A carta do topo do grimório; "topdeckar" é comprar exatamente o que precisava.','"Estava sem mão e topdeckei o raio."'],
  ['Removal','Remoção: carta que tira uma ameaça do jogo (destruir, exilar, dano).','"Guarde a removal para o comandante dele."'],
  ['Ramp','Aceleração de mana: cartas que dão mana extra ou buscam terrenos.','"Abri com ramp no turno 2."'],
  ['Card advantage','Vantagem de cartas: ter mais cartas (na mão ou em jogo) que o oponente.','"Essa troca dois por um me deu card advantage."'],
  ['2 por 1','Uma carta sua que resolve duas do oponente.','"A bola de fogo matou duas criaturas: 2 por 1."'],
  ['Value','Valor: tirar mais de uma carta do que ela custou.','"Essa criatura é puro value: compra e ainda bloqueia."'],
  ['Curve / curva','A distribuição de custos do deck; "curvar" é usar toda a mana em cada turno.','"Curvei perfeito: 1, 2, 3 e 4."'],
  ['Aggro','Deck agressivo que tenta vencer rápido.','"Contra aggro, priorize bloquear."'],
  ['Control','Deck de controle que responde a tudo e vence no fim.','"Control odeia ameaças com resistência a anular."'],
  ['Midrange','Deck meio-termo: criaturas fortes e respostas.','"Golgari midrange é o clássico."'],
  ['Combo','Duas ou mais cartas que juntas vencem ou geram algo infinito.','"Ele montou o combo e ganhou do nada."'],
  ['Wincon','Win condition: a forma principal de o deck vencer.','"A wincon do meu deck é o dragão."'],
  ['Sweeper','Outro nome para remoção em massa.','"Joguei um sweeper e limpei a mesa."'],
  ['Counter / anular','Mágica que impede outra mágica de resolver.','"Ele deixou 2 azuis abertos: cuidado com counter."'],
  ['Mana screw','Ficar travado com poucos terrenos.','"Perdi de mana screw: fiquei com 2 terrenos."'],
  ['Mana flood','Comprar terrenos demais e pouca ação.','"Flood: comprei 6 terrenos seguidos."'],
  ['Mull / Mulligan','Embaralhar a mão inicial e comprar de novo (com uma carta a menos).','"Mão sem terreno: mulligan."'],
  ['Sideboard / side','Cartas reserva usadas entre partidas de uma melhor de três.','"Entrei com 3 cartas do side contra ele."'],
  ['Meta','O que está sendo mais jogado no momento.','"Burn está forte no meta."'],
  ['Tier 1','Os decks mais fortes do meta.','"Esse deck é tier 1 no Padrão."'],
  ['Netdeck','Deck copiado da internet.','"Fui de netdeck no torneio."'],
  ['Brew','Deck criado por você, original.','"Montei um brew de encantamentos."'],
  ['Pet card','Carta favorita que você coloca em todo deck.','"Essa é a minha pet card."'],
  ['Staple','Carta muito usada em vários decks de um formato.','"Sol Ring é staple de Commander."'],
  ['Bomb','Carta tão forte que decide o jogo (muito usado no Draft).','"Abri uma bomb no booster."'],
  ['Pump','Truque que dá +X/+X a uma criatura.','"Ele usou um pump no bloqueio."'],
  ['Chump block','Bloquear com uma criatura que vai morrer só para não tomar dano.','"Dei chump block para não morrer."'],
  ['Alpha strike','Atacar com tudo de uma vez.','"Alpha strike para fechar o jogo."'],
  ['Lethal','Dano suficiente para vencer neste turno.','"Tenho lethal: 7 de dano e ele está com 7."'],
  ['Go wide / Go tall','Go wide: muitas criaturas pequenas. Go tall: uma criatura gigante.','"Meu deck vai wide com fichas."'],
  ['Voltron','Uma criatura cheia de auras/equipamentos.','"Deck voltron do comandante equipado."'],
  ['Mill / moer','Mandar cartas do grimório para o cemitério.','"Moí 10 cartas dele."'],
  ['Bounce','Devolver uma permanente para a mão do dono.','"Dei bounce na criatura dele."'],
  ['Blink / Flicker','Exilar e devolver uma permanente ao campo na hora.','"Blink para repetir o ETB."'],
  ['Reanimar','Trazer uma criatura do cemitério para o campo.','"Reanimei o monstro no turno 2."'],
  ['Sac outlet','Carta que deixa sacrificar criaturas sem custo de mana.','"Preciso de um sac outlet para o combo."'],
  ['Rule 0','No Commander, a conversa antes do jogo sobre o nível dos decks.','"Na rule 0 avisei que meu deck é bracket 3."'],
  ['Bracket','Nível de poder dos decks de Commander (1 a 5).','"Vamos jogar bracket 2, casual."'],
  ['cEDH','Commander competitivo, com os decks mais fortes possíveis.','"Esse combo é coisa de cEDH."'],
  ['Proxy','Cópia impressa de uma carta para testar (não vale em torneio).','"Joguei com proxy antes de comprar."'],
  ['Foil','Versão brilhante da carta.','"Tirei uma foil rara."'],
  ['Curinga','No Arena, item usado para criar qualquer carta da raridade dele.','"Gastei 4 curingas raros no deck."'],
  ['Brawl','Formato do Arena parecido com Commander, com comandante.','"Fiz um deck de Brawl com meu comandante favorito."'],
  ['Bo1 / Bo3','Melhor de 1 ou melhor de 3 partidas.','"No Bo3 dá para usar o sideboard."'],
  ['Hate / hoser','Carta feita para atrapalhar uma estratégia específica.','"Coloquei hate de cemitério contra reanimator."']
];
(function(){
  const bi = buildIndex;
  buildIndex = function(){ const I = bi(); GLOSS.forEach(([t, d, ex]) => I.push({t: t + ' (gíria)', d: strip(d).slice(0, 180), cat:'Gíria', go: () => { glossOpen(t); }, T: stoks(t), K: stoks('giria girias termo glossario jargao ' + t), D: stoks(d + ' ' + ex)})); return I; };
})();
let glQ = '';
function glossOpen(t){ glQ = t ? t.split(' ')[0] : ''; deckTab = 'gloss'; show('arena'); }
function renderGloss(){
  const q = norm(glQ || ''), L = GLOSS.filter(g => !q || norm(g.join(' ')).includes(q)), read = S.trail.gloss || {};
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Glossário de gírias do Magic</h3><p class="muted" style="margin:0">Os termos que aparecem nos vídeos, nas lojas e nas partidas. Toque num termo para marcá-lo como aprendido (${Object.keys(read).length} de ${GLOSS.length}).</p>
    <input type="search" id="glQ" placeholder="Procurar termo (ex.: tutor, ETB, flood)" value="${esc(glQ)}">
    <div class="gl-grid">${L.map(([t, d, ex]) => `<button class="gl-i ${read[t] ? 'ok' : ''}" data-gl="${esc(t)}"><b>${esc(t)}</b><span>${d}</span><small>${ex}</small>${read[t] ? '<i>✓</i>' : ''}</button>`).join('') || '<p class="muted">Nenhum termo com essa palavra.</p>'}</div></div>`;
  const qi = $('#glQ'); qi.oninput = () => { glQ = qi.value; const p = qi.selectionStart; renderGloss(); const n = $('#glQ'); n.focus(); n.setSelectionRange(p, p); };
  $$('[data-gl]').forEach(b => b.onclick = () => { S.trail.gloss = S.trail.gloss || {}; const t = b.dataset.gl; if (S.trail.gloss[t]) delete S.trail.gloss[t]; else S.trail.gloss[t] = 1; save(); renderGloss(); });
}

/* ---------- 9. Trilha do Planeswalker ---------- */
const TRAIL2 = [
  {k:'regras', t:'Aprenda as regras básicas', d:'Faça pelo menos 3 lições da Academia.', ok:() => Object.keys(S.done || {}).length >= 3, go:() => show('academia')},
  {k:'vinc', t:'Vincule sua conta do Arena', d:'Traga as suas cartas do Arena para a Academia.', ok:() => Object.keys(S.acoll || {}).length > 0, go:() => { vStep = 0; deckTab = 'vincular'; show('arena'); }},
  {k:'deck', t:'Crie e salve seu primeiro deck', d:'Use o Criar deck do zero e salve em Meus decks.', ok:() => (S.lib || []).length > 0, go:() => { deckTab = 'gerar'; show('construir'); }},
  {k:'estrat', t:'Conheça uma estratégia', d:'Abra uma das estratégias do Magic.', ok:() => !!S.trail.estrat, go:() => { stOpen = null; deckTab = 'estrat'; show('construir'); }},
  {k:'week', t:'Monte o deck da semana', d:'Toda semana uma estratégia nova para experimentar.', ok:() => !!S.trail.weekDone, go:() => { deckTab = 'acoll'; show('arena'); }},
  {k:'wild', t:'Calcule os curingas de um deck', d:'Veja quantos curingas faltam para montar no Arena.', ok:() => !!S.trail.wild, go:() => { deckTab = 'curingas'; show('arena'); }},
  {k:'arena', t:'Leve um deck para o Arena', d:'Use o botão Copiar para o Arena.', ok:() => !!S.trail.arena, go:() => { deckTab = 'guias'; show('arena'); }},
  {k:'mull', t:'Treine 10 mãos de mulligan', d:'Decida manter ou fazer mulligan em 10 mãos.', ok:() => (S.trail.mull || 0) >= 10, go:() => { trTab = 'mull'; show('treino'); }, p:() => `${Math.min(10, S.trail.mull || 0)}/10`},
  {k:'cmp', t:'Compare dois decks', d:'Veja a curva e a estratégia de dois decks lado a lado.', ok:() => !!S.trail.cmp, go:() => { deckTab = 'comparar'; show('decks'); }},
  {k:'gloss', t:'Aprenda 10 gírias do Magic', d:'Marque 10 termos no glossário.', ok:() => Object.keys(S.trail.gloss || {}).length >= 10, go:() => glossOpen(''), p:() => `${Math.min(10, Object.keys(S.trail.gloss || {}).length)}/10`},
  {k:'game', t:'Vire Mago no Sobreviva ao Multiverso', d:'Chegue ao nível 10 no jogo e veja seu mago evoluir.', ok:() => ((S.survMeta || {}).v3 || {}).maxTier >= 1, go:() => { trTab = 'surv'; show('treino'); }},
  {k:'transfer', t:'Proteja seus dados', d:'Gere um código de transferência ou um backup.', ok:() => !!S.trail.transfer || !!S.lastBackup, go:() => { deckTab = 'transfer'; show('meus'); }}
];
const MEDALS2 = [[4, 'Bronze', '#c0814a'], [8, 'Prata', '#c9d1db'], [12, 'Ouro', '#f6c945']];
function trailHTML(){
  const n = TRAIL2.filter(s => { try { return s.ok(); } catch(e){ return false; } }).length, med = MEDALS2.filter(m => n >= m[0]).pop(), next = MEDALS2.find(m => n < m[0]);
  if (n >= 4 && !S.trail['m' + 4]) { S.trail.m4 = 1; addXP(20); save(); } if (n >= 8 && !S.trail.m8){ S.trail.m8 = 1; addXP(40); save(); } if (n >= 12 && !S.trail.m12){ S.trail.m12 = 1; addXP(80); save(); }
  return `<section class="panel stack-v tr2" id="trail2"><div class="tr2-h"><div><span class="eyebrow">Trilha do Planeswalker</span><h3 style="margin:2px 0 0">Do primeiro deck ao Arena</h3></div>
      <div class="tr2-med">${MEDALS2.map(m => `<span class="tr2-m ${n >= m[0] ? 'on' : ''}" style="--mc:${m[2]}" title="${m[1]}: ${m[0]} etapas">${m[1]}</span>`).join('')}</div></div>
    <div class="v-prog"><span style="width:${Math.round(n / TRAIL2.length * 100)}%"></span></div>
    <small class="muted">${n} de ${TRAIL2.length} etapas${next ? ` · faltam ${next[0] - n} para a medalha de ${next[1]}` : ' · trilha completa! Você é um Planeswalker.'}</small>
    <div class="tr2-grid">${TRAIL2.map((s, i) => { let ok = false; try { ok = s.ok(); } catch(e){} return `<button class="tr2-s ${ok ? 'ok' : ''}" data-tr2="${i}"><span class="tr2-n">${ok ? '✓' : i + 1}</span><b>${s.t}</b><small>${s.d}${s.p && !ok ? ` <b>${s.p()}</b>` : ''}</small></button>`; }).join('')}</div></section>`;
}
function bindTrail(){ $$('[data-tr2]').forEach(b => b.onclick = () => TRAIL2[+b.dataset.tr2].go()); }
(function(){
  const ri = RENDER.inicio;
  RENDER.inicio = function(){ ri.apply(this, arguments); const host = $('#v-inicio'); if (!host || $('#trail2')) return;
    const anchor = host.querySelector('.quick') || host.querySelector('section'); const wrap = document.createElement('div'); wrap.innerHTML = trailHTML() + `<section class="panel stack-v" id="week2" style="margin-top:14px">${weekHTML(false)}</section>`;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(wrap, anchor.nextSibling); else host.appendChild(wrap); bindTrail(); bindWeek(); };
})();
/* copiar para o Arena conta para a trilha */
(function(){ const c0 = copyForArena; copyForArena = function(){ trailMark('arena'); return c0.apply(this, arguments); }; })();

/* ---------- registrar abas, ícones e busca ---------- */
(function(){
  SECTIONS.meus.tabs.push(['transfer', 'Levar para outro aparelho']);
  SECTIONS.arena.tabs.splice(2, 0, ['curingas', 'Curingas do Arena']);
  SECTIONS.arena.tabs.push(['gloss', 'Glossário de gírias']);
  const d0 = DECK_R; DECK_R = () => Object.assign(d0(), {transfer: renderTransfer, curingas: renderWild, gloss: renderGloss});
  Object.assign(TAB_IC, {transfer:'swap', curingas:'star', gloss:'book'});
  Object.assign(TAB_HINT, {transfer:'Código para o celular ou PC', curingas:'Quantos faltam para montar', gloss:'ETB, tutor, flood…'});
  Object.assign(TAB_TXT, {transfer:'Levar para outro aparelho: gera um código com decks, coleções e progresso para abrir em outro celular ou PC.', curingas:'Curingas do Arena: quantos curingas de cada raridade faltam para montar um deck, descontando a sua coleção.', gloss:'Glossário de gírias do Magic: ETB, tutor, cantrip, flood, wincon e outros termos.'});
  FEATS.push(['Levar para outro aparelho','Código de transferência de decks, coleções e progresso','transferir transferencia celular pc outro aparelho codigo backup sincronizar levar',() => { deckTab = 'transfer'; show('meus'); }]);
  FEATS.push(['Curingas do Arena','Quantos curingas faltam para montar um deck','curingas curinga wildcard raro mitico incomum comum arena montar faltam',() => { deckTab = 'curingas'; show('arena'); }]);
  FEATS.push(['Deck da semana','Uma estratégia nova por semana para montar com as suas cartas','deck da semana semanal sugestao estrategia',() => { show('inicio'); setTimeout(() => { const w = $('#week2'); w && w.scrollIntoView({block:'center', behavior:'smooth'}); }, 150); }]);
  FEATS.push(['Trilha do Planeswalker','Etapas com medalhas: regras, Arena, decks, mulligan, jogo','trilha iniciante comecar medalhas etapas progresso caminho',() => { show('inicio'); setTimeout(() => { const w = $('#trail2'); w && w.scrollIntoView({block:'start', behavior:'smooth'}); }, 150); }]);
  FEATS.push(['Glossário de gírias','ETB, tutor, cantrip, flood, wincon e outros termos','glossario girias termos jargao etb tutor cantrip flood screw wincon topdeck',() => glossOpen('')]);
  if (tfIncoming) setTimeout(() => { deckTab = 'transfer'; show('meus'); }, 500);
})();
