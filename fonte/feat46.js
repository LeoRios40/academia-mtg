/* ================= v4.6: RECURSOS NOVOS =================
   1. Abertura mais leve (o jogo carrega só quando é aberto)  2. Usar sem internet (cartas e imagens guardadas)
   3. Verificação automática                                  7. Melhorar só com as minhas cartas
   8. Plano de curingas   9. Histórico de partidas   10. Aulas animadas de estratégia   11. Coleções do momento */

/* ---------- 1. carregar o jogo só quando for aberto ---------- */
function lzLoad(id){
  if (lzLoad.done[id]) return true; const src = document.getElementById('lz-' + id); if (!src) return false;
  const s = document.createElement('script'); s.textContent = src.textContent; document.body.appendChild(s); src.remove(); lzLoad.done[id] = 1; return true;
}
lzLoad.done = {};
function renderSurv(box){ if (!lzLoad('g3')) { (box || $('#trBody')).innerHTML = '<div class="panel"><p class="muted">Não consegui carregar o jogo.</p></div>'; return; } return G3.menu(box || $('#trBody')); }

/* ---------- 2. cartas guardadas para usar sem internet ---------- */
const CC = {db:null, pend:{}, t:0, names:new Set()};
function ccOpen(){ return new Promise(res => { try { const r = indexedDB.open('academiaCartas', 1); r.onupgradeneeded = () => r.result.createObjectStore('c'); r.onsuccess = () => { CC.db = r.result; res(CC.db); }; r.onerror = () => res(null); } catch(e){ res(null); } }); }
function ccFlush(){ if (!CC.db) return; const P = CC.pend; CC.pend = {}; try { const tx = CC.db.transaction('c', 'readwrite'), st = tx.objectStore('c'); Object.entries(P).forEach(([k, v]) => st.put(v, k)); } catch(e){} }
(function(){
  const rg = regCard;
  regCard = function(c){ rg(c); try { const n = c.name; CC.names.add(n); CC.pend[n] = {c:CARDS[n], img:IMG[n.toLowerCase()] || '', arn:ARN[n] || '', leg:LEG[n]}; clearTimeout(CC.t); CC.t = setTimeout(ccFlush, 1500); } catch(e){} };
  ccOpen().then(db => { if (!db) return; try { const tx = db.transaction('c', 'readonly'), st = tx.objectStore('c'), rq = st.openCursor(); rq.onsuccess = () => { const cur = rq.result; if (!cur) return; const n = cur.key, v = cur.value; CC.names.add(n);
    if (v && v.c && !CARDS[n]){ CARDS[n] = v.c; CARD_ALIAS[n.toLowerCase()] = n; } if (v && v.img && !IMG[n.toLowerCase()]) IMG[n.toLowerCase()] = v.img; if (v && v.arn && !ARN[n]) ARN[n] = v.arn; if (v && v.leg && !LEG[n]) LEG[n] = v.leg; cur.continue(); }; } catch(e){} });
})();
async function offInfo(){ let imgs = 0; try { if (window.caches){ const c = await caches.open('cartas'); imgs = (await c.keys()).length; } } catch(e){} return {cards:CC.names.size, imgs, sw: !!(navigator.serviceWorker && navigator.serviceWorker.controller)}; }
function offNames(){ const N = new Set(); (S.lib || []).forEach(D => parseDeck(D.versions[D.versions.length - 1].text).forEach(e => N.add(CARD_ALIAS[e.name.toLowerCase()] || e.name))); parseDeck(deckText || '').forEach(e => N.add(CARD_ALIAS[e.name.toLowerCase()] || e.name)); return [...N].filter(n => !isBasic(n)); }
function renderOffline(){
  const file = location.protocol === 'file:';
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Usar sem internet</h3>
    <p class="muted" style="margin:0">A Academia guarda os dados das cartas que você já consultou (nome, texto, legalidade). ${file ? 'No arquivo HTML, as <b>imagens</b> precisam de internet; pelo site instalado como aplicativo elas também ficam guardadas.' : 'Pelo site, as imagens das cartas também ficam guardadas no aparelho.'}</p>
    <div class="off-grid" id="offInfo"><span class="muted">Conferindo…</span></div>
    <button class="btn primary" id="offGet" style="align-self:flex-start">Baixar tudo dos meus decks agora</button><div id="offSt" class="muted" role="status"></div></div>`;
  const info = async () => { const I = await offInfo(); const el = $('#offInfo'); if (el) el.innerHTML = `<span><b>${I.cards}</b>cartas com dados guardados</span><span><b>${file ? '—' : I.imgs}</b>imagens guardadas</span><span><b>${I.sw ? 'Sim' : 'Não'}</b>funciona offline${file ? ' (só pelo site)' : ''}</span>`; };
  info();
  $('#offGet').onclick = async () => { const st = m => { const e = $('#offSt'); if (e) e.textContent = m; }, N = offNames(); if (!N.length){ st('Nenhum deck salvo ainda.'); return; }
    st(`Baixando dados de ${N.length} cartas…`); try { await fetchLegal(N); } catch(e){ st('Sem conexão com o Scryfall agora.'); return; }
    let ok = 0; if (!file){ const urls = N.map(n => IMG[n.toLowerCase()] || (CARDS[n] && CARDS[n].img)).filter(Boolean); for (let i = 0; i < urls.length; i++){ try { await fetch(urls[i], {mode:'no-cors'}); ok++; } catch(e){} if (i % 10 === 0) st(`Guardando imagens… ${i + 1} de ${urls.length}`); } }
    ccFlush(); st(`Pronto: ${N.length} cartas${file ? '' : ` e ${ok} imagens`} guardadas para usar sem internet.`); trailMark('offline'); info(); };
}

/* ---------- 3. verificação automática (painel de diagnóstico) ---------- */
DIAG.push(
  ['Jogo Sobreviva ao Multiverso', 'Carrega o jogo e desenha os personagens', async () => { if (!lzLoad('g3') && typeof G3 === 'undefined') throw new Error('não carregou'); return 'ok'; }],
  ['Estratégias do Magic', 'Detector e montagem', async () => { if (STRATS.length < 20 || typeof stBuild !== 'function') throw new Error('incompleto'); return STRATS.length + ' estratégias'; }],
  ['Código de transferência', 'Gera e lê o código', async () => { const c = await tfEncode(), D = await tfDecode(c); if (!D || typeof D !== 'object') throw new Error('falhou'); return Math.round(c.length / 1024) + ' KB'; }],
  ['Cartas guardadas', 'Usar sem internet', async () => { const I = await offInfo(); return I.cards + ' cartas, ' + I.imgs + ' imagens'; }]
);

/* ---------- 7. Melhorar meu deck só com as minhas cartas ---------- */
(function(){
  const s2 = owStep2;
  owStep2 = function(){ const h = s2(); if (!Object.keys(S.acoll || {}).length) return h;
    return h.replace('<div class="row-h"><button class="btn primary" id="owGo">', `<label class="chk ow-only"><input type="checkbox" id="owOnly" ${opt.onlyOwn ? 'checked' : ''}><span><b>Só cartas que já tenho no Arena</b> (sem gastar curingas): as sugestões usam apenas a sua coleção.</span></label><div class="row-h"><button class="btn primary" id="owGo">`); };
  const bo = bindOw;
  bindOw = function(){ bo.apply(this, arguments); const c = $('#owOnly'); if (c) c.onchange = () => { opt.onlyOwn = c.checked; opt.res = null; }; };
  const od = optimizeDeck;
  optimizeDeck = async function(st){
    if (!opt.onlyOwn || !Object.keys(S.acoll || {}).length) return od(st);
    const fq = fetchQ; fetchQ = async (q, max) => (await fq(q, 175)).filter(n => owned(n)).slice(0, max || 40);
    let res; try { res = await od(st); } finally { fetchQ = fq; }
    /* respeita quantas cópias você tem e repõe o que faltar com as cartas originais do deck */
    const orig = new Map(ent.A.R.entries.map(e => [e.name, e.q])), target = ent.A.R.entries.reduce((a, e) => a + e.q, 0);
    res.list.forEach(e => { if (isBasic(e.name)) return; const mx = Math.max(owned(e.name), orig.get(e.name) || 0); if (e.q > mx) e.q = mx; });
    res.list = res.list.filter(e => e.q > 0); let deficit = target - res.list.reduce((a, e) => a + e.q, 0);
    for (const r of res.removed.slice()){ if (deficit <= 0) break; const k = Math.min(r.q, deficit); res.list.push({name:r.n, q:k}); deficit -= k; res.removed = res.removed.filter(x => x !== r); }
    for (const [n, q] of orig){ if (deficit <= 0) break; if (isBasic(n)) continue; const cur = res.list.find(e => e.name === n), have = cur ? cur.q : 0; if (have < q){ const k = Math.min(q - have, deficit); if (cur) cur.q += k; else res.list.push({name:n, q:k}); deficit -= k; } }
    if (deficit > 0){ const b = res.list.find(e => isBasic(e.name)); if (b) b.q += deficit; }
    res.added = res.added.filter(a => res.list.some(e => e.name === a.n)).map(a => Object.assign(a, {q:(res.list.find(e => e.name === a.n) || {}).q || a.q}));
    res.onlyOwn = true; return res;
  };
})();

/* ---------- 8. Plano de curingas ---------- */
async function wildPlan(st){
  const decks = (S.lib || []).map(D => ({name:D.name, txt:D.versions[D.versions.length - 1].text, sing:!!D.cmd})); if (asd && asd.res) decks.unshift({name:'Último deck do Criar deck do zero', txt:arenaList(asd.res.list, asd.res.cmd), sing:!!asd.res.cmd});
  const out = []; for (let i = 0; i < decks.length; i++){ st && st(`Conferindo ${i + 1} de ${decks.length}…`); const W = await wildCalc(parseDeck(decks[i].txt), decks[i].sing); out.push(Object.assign({}, decks[i], {W, tot:['c', 'u', 'r', 'm'].reduce((a, k) => a + W.need[k], 0), cost:W.need.m * 8 + W.need.r * 4 + W.need.u * 1.5 + W.need.c})); }
  out.sort((a, b) => a.cost - b.cost);
  const have = Object.assign({c:0, u:0, r:0, m:0}, S.wild || {}), left = Object.assign({}, have);
  out.forEach(d => { d.now = ['c', 'u', 'r', 'm'].every(k => left[k] >= d.W.need[k]); if (d.now) ['c', 'u', 'r', 'm'].forEach(k => left[k] -= d.W.need[k]); });
  return {out, left};
}
(function(){
  const rw = renderWild;
  renderWild = function(){ rw(); const p = $('#deckBody .panel'); if (!p) return;
    p.insertAdjacentHTML('afterend', `<div class="panel stack-v" style="margin-top:14px"><h3>Plano de curingas</h3><p class="muted" style="margin:0">Em que ordem montar os seus decks salvos, gastando menos curingas raros e míticos primeiro.</p>
      <button class="btn" id="wpGo" style="align-self:flex-start" ${(S.lib || []).length || (asd && asd.res) ? '' : 'disabled'}>Montar o plano</button><div id="wpOut"></div></div>`);
    $('#wpGo').onclick = async () => { const o = $('#wpOut'), st = m => o.innerHTML = `<span class="muted">${m}</span>`; const P = await wildPlan(st);
      o.innerHTML = `<ol class="wp-l">${P.out.map(d => `<li class="${d.now ? 'ok' : ''}"><b>${esc(d.name)}</b><span>${d.tot ? ['m', 'r', 'u', 'c'].filter(k => d.W.need[k]).map(k => `<i class="wc-${k}"><span class="wc-ic"></span>${d.W.need[k]}</i>`).join(' ') : '<i>nenhum curinga</i>'}</span><small>${d.now ? '✓ Dá para montar com os curingas que sobram' : 'Ainda faltam curingas: abra boosters ou jogue mais'}</small></li>`).join('')}</ol>
        <p class="muted" style="margin:6px 0 0">Depois do plano sobram: ${['m', 'r', 'u', 'c'].map(k => `${P.left[k]} ${({c:'comuns', u:'incomuns', r:'raros', m:'míticos'})[k]}`).join(', ')}.</p>`; trailMark('wild'); };
  };
})();

/* ---------- 9. Histórico de partidas ---------- */
function hist(){ return (S.hist = S.hist || []); }
function renderHist(){
  const H = hist(), libs = S.lib || [], deckName = id => { const D = libs.find(d => d.id === id); return D ? D.name : id === 'deck' ? 'Deck em uso' : '—'; };
  const by = {}; H.forEach(m => { const k = m.deck; by[k] = by[k] || {w:0, l:0, d:0, vs:{}}; by[k][m.r]++; if (m.vs){ by[k].vs[m.vs] = by[k].vs[m.vs] || {w:0, l:0, d:0}; by[k].vs[m.vs][m.r]++; } });
  const pct = o => { const t = o.w + o.l + o.d; return t ? Math.round(o.w / t * 100) : 0; };
  $('#deckBody').innerHTML = `<div class="grid g2" style="align-items:start">
    <form class="panel stack-v" id="hiForm"><h3>Anotar partida</h3>
      <label class="f">Deck<select id="hiDeck">${libs.map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join('')}<option value="deck">Deck em uso</option></select></label>
      <div class="seg hi-r"><button type="button" class="chip" data-hr="w" aria-pressed="true">Vitória</button><button type="button" class="chip" data-hr="l" aria-pressed="false">Derrota</button><button type="button" class="chip" data-hr="d" aria-pressed="false">Empate</button></div>
      <label class="f">Contra qual estratégia?<select id="hiVs"><option value="">Não sei</option>${STRATS.map(s => `<option value="${s.k}">${s.n}</option>`).join('')}</select></label>
      <div class="seg"><button type="button" class="chip" data-hw="Arena" aria-pressed="true">MTG Arena</button><button type="button" class="chip" data-hw="Mesa" aria-pressed="false">Mesa física</button></div>
      <label class="f">Anotação (opcional)<input type="text" id="hiNote" maxlength="120" placeholder="Ex.: travei de terreno, o comandante dele era forte…"></label>
      <button class="btn primary" type="submit">Salvar partida</button></form>
    <div class="panel stack-v"><h3>Aproveitamento</h3>${Object.keys(by).length ? Object.entries(by).map(([k, o]) => `<div class="hi-d"><div class="row-h" style="justify-content:space-between"><b>${esc(deckName(k))}</b><span>${o.w}V ${o.l}D${o.d ? ' ' + o.d + 'E' : ''} · <b>${pct(o)}%</b></span></div><span class="own-bar"><i style="width:${pct(o)}%;background:#4cae6b"></i></span>
      ${Object.keys(o.vs).length ? `<small class="muted">${Object.entries(o.vs).map(([v, x]) => `contra ${stByK(v) ? stByK(v).n : v}: ${pct(x)}% (${x.w + x.l + x.d})`).join(' · ')}</small>` : ''}</div>`).join('') : '<p class="muted">Nenhuma partida anotada ainda.</p>'}
      ${H.length ? `<details><summary>Últimas partidas</summary><ul class="hi-l">${H.slice(-30).reverse().map((m, i) => `<li><b class="hi-${m.r}">${({w:'V', l:'D', d:'E'})[m.r]}</b> ${esc(deckName(m.deck))}${m.vs && stByK(m.vs) ? ' × ' + stByK(m.vs).n : ''} · ${m.w} · ${m.d}${m.note ? ' · ' + esc(m.note) : ''} <button class="icon-btn" data-hdel="${H.length - 1 - i}" aria-label="Apagar">✕</button></li>`).join('')}</ul></details>` : ''}</div></div>`;
  let r = 'w', w = 'Arena';
  $$('[data-hr]').forEach(b => b.onclick = () => { r = b.dataset.hr; $$('[data-hr]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $$('[data-hw]').forEach(b => b.onclick = () => { w = b.dataset.hw; $$('[data-hw]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#hiForm').onsubmit = e => { e.preventDefault(); hist().push({deck:$('#hiDeck').value, r, vs:$('#hiVs').value, w, note:$('#hiNote').value.trim(), d:today()}); save(); trailMark('hist'); toast('Partida anotada.'); renderHist(); };
  $$('[data-hdel]').forEach(b => b.onclick = () => { hist().splice(+b.dataset.hdel, 1); save(); renderHist(); });
}

/* ---------- 10. Aulas animadas de estratégia ---------- */
let lsn = null;
function lessonSlides(s){
  return [
    {t:s.n, h:`<div class="ls-big">${stPips(s.cols) || '✦'}</div><p class="ls-lead">${s.en}</p><p>${s.o}</p>`},
    {t:'Como vence', h:`<p class="ls-lead">${s.v}</p>`},
    {t:'Cartas-chave', h:`<div class="ls-cards">${s.ex.slice(0, 4).map(n => cardHTML(n, {showPt:false})).join('')}</div>`},
    {t:'Como jogar', h:`<ol class="ls-ol">${s.uso.map((u, i) => `<li style="--d:${i * .25}s">${u}</li>`).join('')}</ol>`},
    {t:'Onde usar', h:`<p><b>Na mesa:</b> ${s.onde}</p><p><b>No Arena:</b> ${s.arena}</p>`},
    {t:'Cuidado com…', h:`<p class="ls-lead">${s.fraco}</p>`}
  ];
}
function lessonQuiz(s){
  const others = STRATS.filter(x => x.k !== s.k), pick = (a, n) => shuffled(a).slice(0, n);
  const q1o = shuffled([s.ex[0]].concat(pick(others, 3).map(x => x.ex[0])));
  const q2o = shuffled([s.v].concat(pick(others, 2).map(x => x.v)));
  const q3o = shuffled([s.fraco].concat(pick(others, 2).map(x => x.fraco)));
  return [{q:`Qual destas cartas é típica de ${s.n}?`, o:q1o, a:s.ex[0]}, {q:`Como um deck ${s.n} costuma vencer?`, o:q2o, a:s.v}, {q:`Qual é o ponto fraco de ${s.n}?`, o:q3o, a:s.fraco}];
}
function openLesson(k){ const s = stByK(k); if (!s) return; lsn = {s, i:0, sl:lessonSlides(s), quiz:null, qi:0, ok:0, ans:null}; drawLesson(); }
function drawLesson(){
  let el = $('#lsn'); if (!el){ el = document.createElement('div'); el.id = 'lsn'; el.className = 'lsn'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Aula de estratégia'); document.body.appendChild(el); }
  const L = lsn, N = L.sl.length, inQuiz = !!L.quiz;
  let body;
  if (!inQuiz){ const sl = L.sl[L.i]; body = `<div class="ls-slide" key="${L.i}"><span class="ls-k">${L.s.n} · ${L.i + 1}/${N}</span><h2>${sl.t}</h2>${sl.h}</div>
    <div class="ls-nav"><button class="btn" id="lsPrev" ${L.i ? '' : 'disabled'}>← Voltar</button><div class="ls-dots">${L.sl.map((_, i) => `<i class="${i === L.i ? 'on' : ''}"></i>`).join('')}</div>${L.i < N - 1 ? '<button class="btn primary" id="lsNext">Próximo →</button>' : '<button class="btn primary" id="lsQuiz">Fazer o quiz</button>'}</div>`; }
  else if (L.qi < L.quiz.length){ const Q = L.quiz[L.qi]; body = `<div class="ls-slide"><span class="ls-k">Quiz · pergunta ${L.qi + 1} de ${L.quiz.length}</span><h2>${Q.q}</h2><div class="ls-opts">${Q.o.map((o, i) => `<button class="ls-o ${L.ans != null ? (o === Q.a ? 'ok' : i === L.ans ? 'no' : '') : ''}" data-lo="${i}" ${L.ans != null ? 'disabled' : ''}>${o}</button>`).join('')}</div></div>
    <div class="ls-nav"><span></span>${L.ans != null ? `<button class="btn primary" id="lsQn">${L.qi < L.quiz.length - 1 ? 'Próxima pergunta' : 'Ver resultado'}</button>` : ''}</div>`; }
  else { const all = L.ok === L.quiz.length; body = `<div class="ls-slide ls-end"><span class="ls-k">Aula concluída</span><h2>${all ? 'Perfeito!' : L.ok ? 'Muito bem!' : 'Vale rever a aula'}</h2><p class="ls-lead">Você acertou ${L.ok} de ${L.quiz.length}.</p>${all ? '<div class="ls-big">🏅</div>' : ''}
    <div class="row-h" style="justify-content:center"><button class="btn primary" id="lsBuild">Montar um deck ${L.s.n}</button><button class="btn" id="lsAgain">Rever a aula</button></div></div><div class="ls-nav"><span></span><button class="btn" id="lsEnd">Fechar</button></div>`;
    S.trail.lessons = S.trail.lessons || {}; S.trail.lessons[L.s.k] = Math.max(S.trail.lessons[L.s.k] || 0, L.ok); save(); if (all && !S.trail['lx' + L.s.k]){ S.trail['lx' + L.s.k] = 1; addXP(10); save(); } }
  el.innerHTML = `<div class="ls-box"><button class="icon-btn ls-x" id="lsX" aria-label="Fechar">✕</button>${body}</div>`; el.hidden = false; document.body.style.overflow = 'hidden';
  const close = () => { el.hidden = true; el.innerHTML = ''; document.body.style.overflow = ''; document.removeEventListener('keydown', lsKey); };
  $('#lsX').onclick = close; const e2 = $('#lsEnd'); if (e2) e2.onclick = close;
  const p = $('#lsPrev'); if (p) p.onclick = () => { L.i--; drawLesson(); };
  const n = $('#lsNext'); if (n) n.onclick = () => { L.i++; drawLesson(); };
  const q = $('#lsQuiz'); if (q) q.onclick = () => { L.quiz = lessonQuiz(L.s); L.qi = 0; L.ok = 0; L.ans = null; drawLesson(); };
  $$('[data-lo]').forEach(b => b.onclick = () => { L.ans = +b.dataset.lo; if (L.quiz[L.qi].o[L.ans] === L.quiz[L.qi].a){ L.ok++; sfx('ok'); } else sfx('no'); drawLesson(); });
  const qn = $('#lsQn'); if (qn) qn.onclick = () => { L.qi++; L.ans = null; drawLesson(); };
  const bd = $('#lsBuild'); if (bd) bd.onclick = () => { close(); stBuild(L.s.k, {arena:true}); };
  const ag = $('#lsAgain'); if (ag) ag.onclick = () => openLesson(L.s.k);
  document.removeEventListener('keydown', lsKey); document.addEventListener('keydown', lsKey);
}
function lsKey(e){ if (!lsn || !$('#lsn') || $('#lsn').hidden) return; if (e.key === 'Escape') $('#lsX').click(); if (e.key === 'ArrowRight' && $('#lsNext')) $('#lsNext').click(); if (e.key === 'ArrowLeft' && $('#lsPrev') && !$('#lsPrev').disabled) $('#lsPrev').click(); }
(function(){
  const rs = renderStrats;
  renderStrats = function(){ rs(); const s = stOpen && stByK(stOpen);
    if (s){ const h = $('.st-detail h3'); if (h && !$('#lsOpen')) h.insertAdjacentHTML('afterend', `<button class="btn primary ls-btn" id="lsOpen">▶ Assistir à aula animada (com quiz)</button>`); const b = $('#lsOpen'); if (b) b.onclick = () => openLesson(s.k); }
    else { const done = S.trail.lessons || {}; $$('.st-card').forEach(c => { const k = c.dataset.stopen; if (done[k] != null && !c.querySelector('.st-done')) c.insertAdjacentHTML('beforeend', `<span class="st-done">✓ aula feita</span>`); }); }
  };
})();

/* ---------- 11. Coleções do momento ---------- */
let SETS = null;
async function loadSets(){
  if (SETS) return SETS;
  try { const c = JSON.parse(localStorage.getItem('academiaPlaneswalker.sets') || 'null'); if (c && c.d === today()) return SETS = c.v; } catch(e){}
  const r = await fetch('https://api.scryfall.com/sets', {headers:{Accept:'application/json'}}); if (!r.ok) throw new Error('HTTP ' + r.status);
  const all = (await r.json()).data.filter(s => ['expansion', 'core'].includes(s.set_type));
  const now = new Date().toISOString().slice(0, 10), done = all.filter(s => s.released_at && s.released_at <= now).sort((a, b) => b.released_at.localeCompare(a.released_at)), next = all.filter(s => s.released_at && s.released_at > now).sort((a, b) => a.released_at.localeCompare(b.released_at));
  const cand = done.slice(0, 14), std = [];
  for (const s of cand){ try { const q = await fetch('https://api.scryfall.com/cards/search?q=' + encodeURIComponent(`e:${s.code} f:standard`), {headers:{Accept:'application/json'}}); await new Promise(res => setTimeout(res, 110)); if (q.ok) std.push(s.code); } catch(e){} }
  const pick = s => ({code:s.code, name:s.name, d:s.released_at, icon:s.icon_svg_uri, n:s.card_count, arena:!!s.arena_code});
  SETS = {cur:done[0] ? pick(done[0]) : null, prev:done.slice(1, 4).map(pick), next:next.slice(0, 3).map(pick), std:cand.filter(s => std.includes(s.code)).map(pick), arenaCur:(done.find(s => s.arena_code) ? pick(done.find(s => s.arena_code)) : null)};
  try { localStorage.setItem('academiaPlaneswalker.sets', JSON.stringify({d:today(), v:SETS})); } catch(e){}
  return SETS;
}
const brDate = d => d ? d.split('-').reverse().join('/') : '';
function setChip(s, big){ return `<div class="set-c ${big ? 'big' : ''}"><img src="${s.icon}" alt="" width="${big ? 44 : 26}" height="${big ? 44 : 26}" loading="lazy"><div><b>${esc(s.name)}</b><small>${s.code.toUpperCase()} · ${brDate(s.d)}${s.n ? ' · ' + s.n + ' cartas' : ''}${s.arena ? ' · no Arena' : ''}</small></div></div>`; }
function renderSets(){
  $('#deckBody').innerHTML = `<div class="panel stack-v"><h3>Coleções do momento</h3><p class="muted" style="margin:0">Qual é a coleção mais nova do Magic, as próximas e quais valem no formato Padrão hoje. Os dados vêm do Scryfall e são atualizados todo dia.</p><div id="setsOut"><span class="muted">Consultando o Scryfall…</span></div></div>`;
  loadSets().then(T => { const o = $('#setsOut'); if (!o) return;
    o.innerHTML = `${T.cur ? `<span class="eyebrow">Coleção atual</span>${setChip(T.cur, true)}` : ''}
      ${T.next.length ? `<span class="eyebrow" style="margin-top:12px;display:block">Próximas coleções</span><div class="set-g">${T.next.map(s => setChip(s)).join('')}</div>` : ''}
      ${T.std.length ? `<span class="eyebrow" style="margin-top:12px;display:block">Válidas no Padrão (${T.std.length})</span><div class="set-g">${T.std.map(s => setChip(s)).join('')}</div><p class="muted" style="font-size:.86rem">Quando uma coleção nova sai, as mais antigas do Padrão podem rodar (sair do formato). No Arena, elas continuam valendo no Histórico.</p>` : ''}
      ${T.prev.length ? `<details><summary>Coleções anteriores</summary><div class="set-g">${T.prev.map(s => setChip(s)).join('')}</div></details>` : ''}
      <div class="row-h"><button class="btn small" id="setsNew">Ver as cartas da coleção atual</button><button class="btn small" id="setsUp">Atualizar agora</button></div>`;
    $('#setsUp').onclick = () => { SETS = null; try { localStorage.removeItem('academiaPlaneswalker.sets'); } catch(e){} renderSets(); };
    $('#setsNew').onclick = () => { if (T.cur) window.open('https://scryfall.com/sets/' + T.cur.code + '?lang=pt', '_blank', 'noopener'); };
    trailMark('sets');
  }).catch(() => { const o = $('#setsOut'); if (o) o.innerHTML = '<p class="muted">Sem conexão com o Scryfall agora. Tente de novo com internet.</p>'; });
}

/* ---------- trilha: novas etapas ---------- */
TRAIL2.splice(4, 0, {k:'lesson', t:'Assista a uma aula de estratégia', d:'Uma aula animada com quiz no final.', ok:() => Object.keys(S.trail.lessons || {}).length > 0, go:() => { stOpen = null; deckTab = 'estrat'; show('construir'); }});
TRAIL2.push({k:'hist', t:'Anote 3 partidas', d:'Registre vitórias e derrotas dos seus decks.', ok:() => (S.hist || []).length >= 3, go:() => { deckTab = 'hist'; show('meus'); }, p:() => `${Math.min(3, (S.hist || []).length)}/3`});
TRAIL2.push({k:'sets', t:'Descubra a coleção do momento', d:'Veja a coleção atual e o que vale no Padrão.', ok:() => !!S.trail.sets, go:() => { deckTab = 'sets'; show('arena'); }});
MEDALS2.splice(0, MEDALS2.length, [5, 'Bronze', '#c0814a'], [10, 'Prata', '#c9d1db'], [15, 'Ouro', '#f6c945']);

/* ---------- abas, ícones, busca ---------- */
(function(){
  SECTIONS.meus.tabs.push(['hist', 'Histórico de partidas'], ['offline', 'Usar sem internet']);
  SECTIONS.arena.tabs.splice(3, 0, ['sets', 'Coleções do momento']);
  const d0 = DECK_R; DECK_R = () => Object.assign(d0(), {hist: renderHist, offline: renderOffline, sets: renderSets});
  Object.assign(TAB_IC, {hist:'chart', offline:'swap', sets:'star'});
  Object.assign(TAB_HINT, {hist:'Vitórias e derrotas', offline:'Cartas guardadas no aparelho', sets:'Atual, próximas e Padrão'});
  Object.assign(TAB_TXT, {hist:'Histórico de partidas: anote vitórias e derrotas e veja o aproveitamento de cada deck e contra cada estratégia.', offline:'Usar sem internet: guarda dados e imagens das cartas dos seus decks.', sets:'Coleções do momento: a coleção atual do Magic, as próximas e as válidas no Padrão.'});
  FEATS.push(['Histórico de partidas','Anote vitórias e derrotas e veja o aproveitamento','historico partidas vitorias derrotas aproveitamento winrate resultado',() => { deckTab = 'hist'; show('meus'); }]);
  FEATS.push(['Usar sem internet','Guardar cartas e imagens dos seus decks no aparelho','offline sem internet guardar baixar imagens cartas',() => { deckTab = 'offline'; show('meus'); }]);
  FEATS.push(['Coleções do momento','Coleção atual do Magic, as próximas e as do Padrão','colecao atual nova lancamento proxima padrao rotacao set expansao momento',() => { deckTab = 'sets'; show('arena'); }]);
  FEATS.push(['Aulas de estratégia','Aulas animadas com quiz sobre cada estratégia','aula aulas animada estrategia quiz video slides',() => { stOpen = null; deckTab = 'estrat'; show('construir'); }]);
})();
