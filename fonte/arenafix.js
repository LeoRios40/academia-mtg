/* ================= v3.5: CONFERÊNCIA ANTES DE IR PARA O ARENA =================
   Antes de copiar uma lista "para o Arena", confere se todas as cartas existem no MTG Arena.
   Se alguma não existir (Sol Ring, Bayou…), mostra quais são e oferece trocar por cartas
   equivalentes do Arena, mantendo a função de cada uma (aceleração, compra, remoção…). */
const isBasic = n => BASICS.includes((n || '').toLowerCase());
async function arenaCheck(list, cmd){
  const names = [...new Set(list.map(e => e.name).concat(cmd ? [cmd] : []))].filter(n => !isBasic(n));
  await fetchLegal(names);
  const bad = names.filter(n => LEG[n] && !LEG[n].arena), unknown = names.filter(n => !LEG[n]);
  return {bad, unknown};
}
function cardRoleQ(n){
  const d = cardData(n) || {}, L = LEG[n] || {}, x = (d.x || '') + ' ' + (L.tl || d.t || '');
  if (/\bLand\b/.test(L.tl || d.t || '')) return {land:1};
  const t = /Creature/.test(x) ? 't:creature' : /Instant/.test(x) ? 't:instant' : /Sorcery/.test(x) ? 't:sorcery' : /Artifact/.test(x) ? 't:artifact' : /Enchantment/.test(x) ? 't:enchantment' : /Planeswalker/.test(x) ? 't:planeswalker' : '';
  let role = '';
  if (/destroy all|exile all|each creature|all creatures get -/i.test(x)) role = RQ.wipe;
  else if (/destroy target|exile target|damage to target|damage to any target|gets -\d/i.test(x)) role = RQ.rem;
  else if (/search your library for (a|up to two) basic land|add \{|add one mana|mana of any/i.test(x)) role = '(o:"add {" or o:"search your library for a basic land" or o:"add one mana")';
  else if (/draw (a|two|three|x) card|draws? cards?/i.test(x)) role = '(o:"draw a card" or o:"draw two cards" or o:"draw cards")';
  else if (/counter target spell/i.test(x)) role = RQ.counter;
  const mv = Math.max(1, Math.round(d.cmc || 0));
  return {q: `${role || t} mv<=${mv + 1}`.trim(), t};
}
async function arenaFix(list, cmd, opts){
  opts = opts || {}; const big = list.reduce((a,e)=>a+e.q,0) >= 95 || !!cmd;
  const fmt = big ? 'f:brawl' : 'f:historic';
  const chk = await arenaCheck(list, cmd);
  let newCmd = cmd, changes = [];
  // cores do deck (comandante ou símbolos de mana)
  let cols = cmd && LEG[cmd] ? LEG[cmd].ci.slice() : [];
  if (!cols.length) { const p = {W:0,U:0,B:0,R:0,G:0}; list.forEach(e => { const d = cardData(e.name); if (d) { const x = pips(d.c); for (const c in x) p[c] += x[c]; } }); cols = Object.keys(p).filter(c => p[c]); }
  const id = (cols.join('') || 'c').toLowerCase();
  if (cmd && chk.bad.includes(cmd)) {
    const L = await fetchQ(`is:commander id=${id} ${fmt} game:arena`, 10);
    if (L.length) { newCmd = L[0]; changes.push([cmd, newCmd, 'comandante']); }
  }
  const used = new Set(list.map(e => e.name).concat(newCmd ? [newCmd] : []));
  const out = [];
  for (const e of list) {
    if (e.name === cmd) continue;
    if (!chk.bad.includes(e.name)) { out.push({...e}); continue; }
    const R0 = cardRoleQ(e.name);
    if (R0.land) {
      let rep = null;
      if (cols.length >= 2) { const L = await fetchQ(`t:land -t:basic produces=${id} ${fmt} game:arena`, 20); rep = L.find(n => !used.has(n)); }
      if (rep) { used.add(rep); out.push({name:rep, q:e.q}); changes.push([e.name, rep, 'terreno']); }
      else { const b = BASIC_OF[cols[0] || 'G']; const ex = out.find(x => x.name === b); if (ex) ex.q += e.q; else out.push({name:b, q:e.q}); changes.push([e.name, b, 'terreno básico']); }
      continue;
    }
    let L = await fetchQ(`${R0.q} id<=${id} ${fmt} game:arena -t:land`, 30).catch(() => []);
    if (!L.filter(n => !used.has(n)).length && R0.t) L = await fetchQ(`${R0.t} id<=${id} ${fmt} game:arena -t:land`, 30).catch(() => []);
    const rep = L.find(n => !used.has(n));
    if (rep) { used.add(rep); out.push({name:rep, q:e.q}); changes.push([e.name, rep, 'mesma função']); }
    else changes.push([e.name, null, 'removida']);
  }
  // completa o total, se faltou alguma carta
  const target = list.reduce((a,e)=>a+e.q,0) - (cmd ? 1 : 0), now = out.reduce((a,e)=>a+e.q,0);
  if (now < target) { const b = BASIC_OF[cols[0] || 'G']; const ex = out.find(x => x.name === b); if (ex) ex.q += target - now; else out.push({name:b, q:target - now}); }
  if (newCmd) out.unshift({name:newCmd, q:1});
  return {list: out, cmd: newCmd, changes, bad: chk.bad};
}
/* copiar com conferência */
async function copyForArena(list, cmd, opts){
  opts = opts || {};
  const sm = m => toast(m);
  let chk;
  try { chk = await arenaCheck(list, cmd); } catch(e) { copyText(arenaList(list, cmd)); sm('Sem conexão para conferir as cartas no Arena. A lista foi copiada assim mesmo.'); return; }
  if (!chk.bad.length) { copyText(arenaList(list, cmd)); sm('Lista copiada. No Arena: Decks → Importar.'); return; }
  const big = list.reduce((a,e)=>a+e.q,0) >= 95 || !!cmd;
  $('#modalBox').innerHTML = `<button class="icon-btn modal-close" aria-label="Fechar" data-close>✕</button><div class="stack-v" style="grid-column:1/-1">
    <span class="eyebrow">Antes de importar</span><h2>${chk.bad.length} carta(s) não existem no MTG Arena</h2>
    <p class="muted" style="margin:0">O Arena recusa a lista inteira se houver uma carta que ele não tem (é o erro "título de card desconhecido"). Estas cartas só existem no papel:</p>
    <div class="af-bad">${chk.bad.map(n => `<span class="pill bad">${esc(n)}</span>`).join('')}</div>
    <p class="muted" style="margin:0;font-size:.9rem">${big ? 'No Arena, o Commander se chama Brawl: 100 cartas, 1 de cada, com comandante. A versão corrigida usa só cartas válidas no Brawl do Arena.' : 'A versão corrigida usa só cartas que existem no Arena (formato Histórico).'}</p>
    <div class="row-h"><button class="btn primary" id="afFix">Trocar por cartas do Arena (recomendado)</button><button class="btn" id="afRaw">Copiar sem trocar</button></div>
    <p class="muted" id="afSt" style="font-size:.88rem;margin:0"></p><div id="afOut"></div></div>`;
  $('#modal').hidden = false;
  $('#afRaw').onclick = () => { copyText(arenaList(list, cmd)); $('#modal').hidden = true; };
  $('#afFix').onclick = async () => {
    const b = $('#afFix'); b.disabled = true; $('#afSt').textContent = 'Procurando cartas equivalentes no Arena…';
    try {
      const F = await arenaFix(list, cmd, opts); const txt = arenaList(F.list, F.cmd);
      $('#afSt').textContent = '';
      $('#afOut').innerHTML = `<span class="eyebrow">Trocas feitas</span><ul class="af-ch">${F.changes.map(([a,b,why]) => `<li><s>${esc(a)}</s> → ${b ? `<b>${esc(b)}</b>` : '<i>removida</i>'} <small class="muted">(${why})</small></li>`).join('')}</ul>
        <pre class="code" id="afTxt">${esc(txt)}</pre><div class="row-h"><button class="btn primary" id="afCopy">Copiar lista para o Arena</button><button class="btn" id="afSave">Salvar em Meus decks</button></div>`;
      $('#afCopy').onclick = () => { copyText(txt, $('#afTxt')); toast('Lista corrigida copiada. No Arena: Decks → Importar.'); };
      $('#afSave').onclick = () => openSaveDialog(txt, {cmd: F.cmd || '', label: 'Versão para o Arena'});
      if (opts.onFixed) opts.onFixed(F);
    } catch(e) { $('#afSt').textContent = 'Não foi possível consultar o Scryfall agora. Tente de novo em instantes.'; b.disabled = false; }
  };
}
/* liga a conferência em todos os botões "Copiar para o Arena" */
(function(){
  const br = bindResult;
  bindResult = function(id, list, cmd, fmt){
    br(id, list, cmd, fmt);
    const c = $(`[data-copy="${id}"]`); if (c) c.onclick = () => copyForArena(list, cmd);
  };
})();
