/* ================= v3.6: CRIAR DECK COM AS MINHAS CARTAS =================
   O "Criar deck do zero" ganha a opção de montar o deck só com as cartas que o jogador já tem
   (coleção do Arena ou coleção física). A Academia analisa a coleção, mostra quais estilos e cores
   ela consegue montar, avisa quando a coleção ainda é pequena e completa só o que faltar. */
const OWN_THEME = {voar:/flying|\bvoar\b/i, grave:/graveyard|cemitério|mill/i, counters:/\+1\/\+1 counter|marcador \+1\/\+1/i, arts:/artifact|artefato/i, life:/gain .* life|ganha .* vida|whenever you gain life/i, dragons:/dragon|dragão/i};
let ownSt = {ready:false, busy:false, names:[], src:null, msg:''};
function ownColl(src){
  if (src === 'fisica') { const m = {}; parseDeck(S.coll || '').forEach(e => { const n = CARD_ALIAS[e.name.toLowerCase()] || e.name; m[n] = (m[n] || 0) + e.q; }); return m; }
  return S.acoll || {};
}
const ownQty = n => { const C = ownColl(asd.own); return C[n] || C[ARN[n]] || C[CARD_ALIAS[(n||'').toLowerCase()]] || 0; };
async function ownPrepare(st){
  const C = ownColl(asd.own), names = Object.keys(C).filter(n => !isBasic(n));
  ownSt = {ready:false, busy:true, names, src:asd.own, msg:''};
  st && st(`Lendo ${names.length} cartas da sua coleção…`);
  for (let i = 0; i < names.length; i += 75) { await fetchLegal(names.slice(i, i + 75)); st && st(`Lendo a coleção… ${Math.min(i + 75, names.length)} de ${names.length}`); }
  ownSt.ready = true; ownSt.busy = false; return ownSt;
}
/* funções de cada carta, pelo texto */
function ownRoles(n){
  const d = cardData(n) || {}, L = LEG[n] || {}, t = L.tl || d.t || '', x = (d.x || '') + ' ', cmc = d.cmc || 0, r = new Set();
  if (/\bLand\b/.test(t) && !/Creature/.test(t)) { r.add('land'); return r; }
  const cr = /Creature/.test(t), inst = /Instant/.test(t), sorc = /Sorcery/.test(t);
  if (/destroy all|exile all|each creature|all creatures get -/i.test(x)) r.add('wipe');
  else if (/destroy target|exile target|damage to target|damage to any target|gets -\d|fights? target/i.test(x)) r.add('rem');
  if (/counter target spell/i.test(x)) r.add('counter');
  if (/draw (a|two|three|x) cards?|draws? (two|three) cards/i.test(x)) { r.add('draw'); if ((inst || sorc) && cmc <= 2) r.add('cantrip'); }
  if (/search your library for (a|up to two) basic land|\{T\}: Add|add one mana of any|add \{[WUBRGC]\}/i.test(x)) r.add('ramp');
  if (/create .*token/i.test(x)) r.add('tok');
  if (/creatures you control get \+/i.test(x)) r.add('anthem');
  if (inst && /gets \+\d|hexproof|indestructible/i.test(x)) r.add('trick');
  if (cr && /prowess|whenever you cast an instant or sorcery/i.test(x)) r.add('prowess');
  if (cr && /flying/i.test(x)) r.add('fly');
  if (cr) r.add(cmc <= 2 ? 'cheap' : cmc <= 4 ? 'mid' : 'big');
  const a = asd.a || {};
  if (a.theme === 'tribal' ? new RegExp(a.tribe, 'i').test(t) : OWN_THEME[a.theme] && OWN_THEME[a.theme].test(x + t)) r.add('theme');
  if (!a.theme || a.theme === 'nenhum') { if (cr) r.add('theme'); }
  return r;
}
function ownLegal(n){
  const F = AF[asd.fmt], L = LEG[n]; if (!L) return false;
  if (F.arena && !L.arena) return false;
  const key = F.q.replace('f:', ''); const v = L.legal[key]; return v === 'legal' || v === 'restricted';
}
const ownInCols = (n, cols) => { const L = LEG[n]; return !!L && L.ci.every(c => cols.includes(c)); };
const RAR_W = {mythic:4, rare:3, uncommon:2, common:1};
function ownPool(cols){
  const F = AF[asd.fmt], copies = F.single ? 1 : 4;
  return ownSt.names.filter(n => ownLegal(n) && ownInCols(n, cols)).map(n => ({n, q: Math.min(copies, ownQty(n)), roles: ownRoles(n), w: RAR_W[(LEG[n] || {}).r] || 1}));
}
/* quanto do plano a coleção consegue preencher */
function ownScore(arch, cols){
  const keep = asd.choice; asd.choice = {arch, cols}; const P = asPlan(); asd.choice = keep;
  const pool = ownPool(cols.split('')).filter(c => !c.roles.has('land')); const used = new Set(); let got = 0;
  for (const [r, n] of Object.entries(P.roles)) { let k = 0; for (const c of pool.filter(c => c.roles.has(r) && !used.has(c.n)).sort((a,b) => b.w - a.w)) { if (k >= n) break; used.add(c.n); k += c.q; } got += Math.min(n, k); }
  const rest = pool.filter(c => !used.has(c.n)).reduce((a,c) => a + c.q, 0);
  const fill = Math.min(P.slots, got + Math.min(rest, (P.slots - got) * .6));
  return {pct: Math.round(fill / P.slots * 100), plan:P};
}
function ownBest(){
  const combos = [];
  const pairs = ['W','U','B','R','G','WU','UB','BR','RG','GW','WB','UR','BG','RW','GU'];
  for (const arch of Object.keys(AS_ARCH)) for (const c of pairs) { if (AF[asd.fmt].cmd && c.length > 2) continue; combos.push({arch, cols:c, s:ownScore(arch, c).pct}); }
  combos.sort((a,b) => b.s - a.s); return combos;
}
/* ---------- telas ---------- */
function ownPickHTML(){
  const A = Object.keys(S.acoll || {}).length, Fi = parseDeck(S.coll || '').length;
  return `<div class="own-pick"><span class="q-t">De onde vêm as cartas?</span>
    <div class="pick own-src">
      <button data-own="" aria-pressed="${!asd.own}"><b>Qualquer carta</b><small>A Academia escolhe as melhores e mostra os curingas que faltam.</small></button>
      <button data-own="arena" aria-pressed="${asd.own==='arena'}" ${A ? '' : 'class="own-empty"'}><b>Só as minhas cartas do Arena</b><small>${A ? `${A} cartas diferentes cadastradas.` : 'Nenhuma carta cadastrada ainda.'}</small></button>
      <button data-own="fisica" aria-pressed="${asd.own==='fisica'}" ${Fi ? '' : 'class="own-empty"'}><b>Só a minha coleção física</b><small>${Fi ? `${Fi} cartas diferentes cadastradas.` : 'Nenhuma carta cadastrada ainda.'}</small></button>
    </div>
    ${asd.own && !(asd.own === 'arena' ? A : Fi) ? `<div class="tip">Cadastre suas cartas primeiro. <button class="btn small" id="ownGoColl">${asd.own === 'arena' ? 'Cadastrar minha coleção do Arena' : 'Cadastrar minha coleção física'}</button></div>` : ''}
    ${asd.own && (asd.own === 'arena' ? A : Fi) ? `<p class="muted" style="margin:0;font-size:.88rem">Depois das perguntas, a Academia mostra quais estilos e cores a sua coleção consegue montar. Se faltar alguma carta, ela avisa e completa só o necessário.</p>` : ''}</div>`;
}
(function(){
  const s1 = asS1; asS1 = () => ownPickHTML() + s1();
  const s3 = asS3;
  asS3 = function(){
    if (!asd.own) return s3();
    if (!ownSt.ready || ownSt.src !== asd.own) { setTimeout(async () => { const st = m => { const e = $('#asSt'); if (e) e.textContent = m; }; try { await ownPrepare(st); st(''); } catch(e) { st('Não foi possível ler a coleção agora (sem conexão com o Scryfall).'); return; } if (asd.step === 3) renderAssist(); }, 30);
      return `<div class="own-load"><b>Analisando a sua coleção…</b><p class="muted">A Academia está lendo cada carta para saber o que dá para montar.</p></div>`; }
    const want = asArch(asd.a); const all = ownBest(); const nm = ownSt.names.filter(n => ownLegal(n)).length;
    const mineFor = all.filter(c => c.arch === want).slice(0, 2), others = all.filter(c => c.arch !== want).filter((c,i,arr) => arr.findIndex(x => x.arch === c.arch) === i).slice(0, 3);
    const top = all[0] || {s:0};
    if (!asd.choice) { const b = mineFor[0] && mineFor[0].s >= 60 ? mineFor[0] : top; asd.choice = {arch:b.arch, cols:b.cols}; }
    const opt = (c, tag) => `<button class="as-rec ${tag ? 'main' : ''}" data-arch="${c.arch}" data-cols="${c.cols}" aria-pressed="${asd.choice.arch===c.arch && asd.choice.cols===c.cols}">
      <span class="as-pips">${c.cols.split('').map(manaSym).join('')}</span><b>${AS_ARCH[c.arch].n} ${asColName(c.cols)}</b>
      <span class="own-bar"><i style="width:${c.s}%;background:${c.s >= 85 ? 'var(--good)' : c.s >= 60 ? 'var(--warn)' : 'var(--bad)'}"></i></span>
      <small><b>${c.s}%</b> do deck com cartas que você já tem</small><small class="muted">${AS_ARCH[c.arch].d}</small>${tag ? `<span class="pill good">${tag}</span>` : ''}</button>`;
    const warn = top.s < 60 ? `<div class="tip af-tip"><b>Sua coleção ainda é pequena para um deck completo de ${AF[asd.fmt].n}.</b> Com ${nm} cartas válidas no formato, nenhum estilo passa de ${top.s}% de cartas suas. Você pode: montar assim mesmo (a Academia completa com cartas que você não tem e mostra os curingas), escolher outro formato na etapa 1 (o Histórico aceita mais cartas antigas) ou cadastrar mais cartas.</div>`
      : mineFor[0] && mineFor[0].s < 60 ? `<div class="tip af-tip">O estilo que você pediu (${AS_ARCH[want].n}) fica com poucas cartas suas (${mineFor[0].s}%). Os estilos abaixo aproveitam melhor a sua coleção.</div>` : '';
    return `<p>Analisei <b>${ownSt.names.length}</b> cartas da sua coleção (${nm} válidas em ${AF[asd.fmt].n}). Pelas respostas, seu estilo é <b>${AS_ARCH[want].n}</b>.</p>${warn}
      <span class="eyebrow">No estilo que você pediu</span><div class="as-recs">${mineFor.map((c,i) => opt(c, i === 0 ? 'Seu estilo' : '')).join('') || '<p class="muted">Nenhuma combinação possível.</p>'}</div>
      <span class="eyebrow">O que a sua coleção monta melhor</span><div class="as-recs">${others.map((c,i) => opt(c, i === 0 ? 'Melhor para a sua coleção' : '')).join('')}</div>
      <div class="row-h"><button class="btn primary" id="asToPlan">${AF[asd.fmt].cmd ? 'Escolher o comandante' : 'Ver a composição do deck'}</button></div>
      <div id="asCmd">${asd.cmdOpts ? asCmdHTML() : ''}</div>`;
  };
  const cm = asCommanders;
  asCommanders = async function(st){
    if (!asd.own) return cm(st);
    const cols = asd.choice.cols.split('');
    const mine = ownSt.names.filter(n => ownLegal(n) && LEG[n] && /Legendary/.test(LEG[n].tl) && /Creature/.test(LEG[n].tl) && LEG[n].ci.join('') && cols.every(c => LEG[n].ci.includes(c)) && LEG[n].ci.every(c => cols.includes(c)));
    if (mine.length) return mine.slice(0, 6);
    const L = await cm(st); toast('Você não tem um comandante dessas cores: estas são sugestões (você precisaria criá-las com curingas).'); return L;
  };
  const gen = asGenerate;
  asGenerate = async function(st){
    if (!asd.own) return gen(st);
    if (!ownSt.ready) await ownPrepare(st);
    const F = AF[asd.fmt], P = asd.plan, copies = F.single ? 1 : 4, cols = asd.choice.cols.split('');
    const pool = ownPool(cols), used = new Set(), out = [], roleOf = {}, missing = new Set();
    if (asd.cmd) { used.add(asd.cmd); if (!ownQty(asd.cmd)) missing.add(asd.cmd); }
    const spells = pool.filter(c => !c.roles.has('land'));
    let count = 0;
    const order = Object.entries(P.roles).sort((x,y) => (x[0]==='theme') - (y[0]==='theme'));
    const short = {};
    for (const [r, n] of order) { let got = 0;
      for (const c of spells.filter(c => c.roles.has(r) && !used.has(c.n)).sort((a,b) => b.w - a.w)) { if (got >= n || count >= P.slots) break; const k = Math.min(c.q, n - got); used.add(c.n); out.push({name:c.n, q:k}); roleOf[c.n] = r; got += k; count += k; }
      if (got < n) short[r] = n - got; }
    // completa com outras cartas suas nas cores
    for (const c of spells.filter(c => !used.has(c.n)).sort((a,b) => b.w - a.w)) { if (count >= P.slots) break; const k = Math.min(c.q, P.slots - count); used.add(c.n); out.push({name:c.n, q:k}); roleOf[c.n] = [...c.roles][0] || 'theme'; count += k; }
    // ainda faltou: sugere cartas (marcadas como "você não tem")
    if (count < P.slots) {
      st('Sua coleção não fecha o deck: escolhendo as cartas que faltam…');
      const base = asBase();
      for (const [r] of Object.entries(short).sort((a,b) => b[1] - a[1]).concat([['theme']])) {
        if (count >= P.slots) break; const q = r === 'theme' ? asThemeQ() : ROLE_Q[r]; if (!q) continue;
        const L = await fetchQ(`${q} ${base}`, 40).catch(() => []);
        for (const name of L) { if (count >= P.slots) break; if (used.has(name)) continue; const k = Math.min(copies, P.slots - count, short[r] || P.slots); used.add(name); out.push({name, q:k}); roleOf[name] = r; if (ownQty(name) < k) missing.add(name); count += k; }
      }
    }
    // terrenos: os seus não básicos nas cores + básicos (de graça no Arena)
    let landLeft = P.lands + Math.max(0, P.slots - count);
    for (const c of pool.filter(c => c.roles.has('land') && !used.has(c.n) && LEG[c.n].ci.length && LEG[c.n].ci.every(x => cols.includes(x))).slice(0, F.single ? 8 : 3)) { const k = Math.min(c.q, landLeft); if (k > 0) { used.add(c.n); out.push({name:c.n, q:k}); roleOf[c.n] = 'lands'; landLeft -= k; } }
    const pp = {}; out.forEach(e => { const p = pips_(cardData(e.name)); for (const c in p) pp[c] = (pp[c]||0) + p[c] * e.q; });
    Object.entries(basicsSplit(pp, landLeft, cols.filter(c => BASIC_OF[c]))).forEach(([n,q]) => { if (q) { out.push({name:n, q}); roleOf[n] = 'lands'; } });
    if (asd.cmd) out.unshift({name:asd.cmd, q:1});
    const nonB = out.filter(e => !isBasic(e.name)), have = nonB.reduce((a,e) => a + Math.min(e.q, ownQty(e.name)), 0), tot = nonB.reduce((a,e) => a + e.q, 0);
    return {list: out, cmd: asd.cmd, roleOf, own:{missing:[...missing], have, tot, pct: tot ? Math.round(have / tot * 100) : 100}};
  };
  const s5 = asS5;
  asS5 = function(){
    let H = s5(); const r = asd.res; if (!r || !r.own) return H;
    const O = r.own;
    const box = `<div class="own-res ${O.missing.length ? 'part' : 'full'}"><b>${O.pct}% do deck com cartas que você já tem</b> <span class="muted">(${O.have} de ${O.tot} cartas, sem contar terrenos básicos)</span>
      ${O.missing.length ? `<p style="margin:4px 0 0">Você ainda não tem: ${O.missing.map(n => `<span class="pill bad">${esc(n)}</span>`).join(' ')}</p><p class="muted" style="margin:4px 0 0;font-size:.86rem">No Arena, crie essas cartas com curingas ou troque-as depois em "Melhorar meu deck".</p>` : '<p style="margin:4px 0 0">Você já tem todas as cartas: é só importar e jogar!</p>'}</div>`;
    return H.replace('<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:start">', box + '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:start">');
  };
  const ba = bindAssist;
  bindAssist = function(){
    ba();
    $$('[data-own]').forEach(b => b.onclick = () => { asd.own = b.dataset.own || null; asd.choice = null; asd.cmd = null; asd.cmdOpts = null; asd.res = null; renderAssist(); });
    const g = $('#ownGoColl'); if (g) g.onclick = () => { deckTab = asd.own === 'arena' ? 'acoll' : 'colecao'; RENDER.decks(); };
    if (asd.step === 5 && asd.res && asd.res.own) {
      const miss = new Set(asd.res.own.missing);
      $$('#asRes .gal-i').forEach(gi => { const c = $('[data-card]', gi); if (c && miss.has(c.dataset.card)) { gi.classList.add('own-miss'); gi.insertAdjacentHTML('beforeend', '<span class="own-tag">Falta</span>'); } });
    }
  };
})();
